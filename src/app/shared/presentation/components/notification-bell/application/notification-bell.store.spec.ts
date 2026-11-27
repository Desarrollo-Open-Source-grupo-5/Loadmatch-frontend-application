import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {signal} from '@angular/core';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {environment} from '../../../../../../environments/environment';
import {SessionStore} from '../../../../../iam/application/session.store';
import {NotificationBellStore} from './notification-bell.store';

describe('NotificationBellStore', () => {
  const endpoint = `${environment.platformApiBaseUrl}/notifications`;
  const owner = 'e30c9500-7a1b-4bbb-9618-11cfa80d3785';
  const otherUser = 'cebcab48-41e3-45ab-ae67-a223684dbbaf';
  const notification = {
    id: '4ad12a23-dce4-4c95-90c9-f74d95b634d5',
    userId: owner,
    type: 'LOAD_ACCEPTED',
    title: 'Load accepted',
    message: 'A carrier accepted your load.',
    urgent: false,
    read: false,
    createdAt: '2026-11-26T20:00:00Z',
    readAt: null
  };

  let currentUser: ReturnType<typeof signal<{id: string; token: string} | null>>;
  let http: HttpTestingController;

  beforeEach(() => {
    currentUser = signal(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NotificationBellStore,
        {provide: SessionStore, useValue: {currentUser}}
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function signIn(userId: string): void {
    currentUser.set({id: userId, token: 'test-token'});
    TestBed.tick();
    tick();
  }

  it('starts polling only after sign-in and refreshes the badge for an existing session', fakeAsync(() => {
    const store = TestBed.inject(NotificationBellStore);
    TestBed.tick();
    tick(30_000);
    expect(store.available()).toBeFalse();
    http.expectNone(request => request.url.startsWith(endpoint));

    signIn(owner);
    http.expectOne({method: 'GET', url: `${endpoint}/unread-count?userId=${owner}`})
      .flush({unreadCount: 1});
    expect(store.state().unreadCount).toBe(1);

    tick(30_000);
    http.expectOne({method: 'GET', url: `${endpoint}/unread-count?userId=${owner}`})
      .flush({unreadCount: 2});
    expect(store.state().unreadCount).toBe(2);
    currentUser.set(null);
    TestBed.tick();
    tick(30_000);
  }));

  it('marks notifications as read only after a successful list request', fakeAsync(() => {
    const store = TestBed.inject(NotificationBellStore);
    signIn(owner);
    http.expectOne(`${endpoint}/unread-count?userId=${owner}`).flush({unreadCount: 1});

    store.load();
    http.expectOne({method: 'GET', url: `${endpoint}?userId=${owner}`})
      .flush({}, {status: 503, statusText: 'Unavailable'});
    http.expectNone(request => request.method === 'POST');
    expect(store.state().error).toBe('list');
    expect(store.state().unreadCount).toBe(1);

    store.load();
    http.expectOne({method: 'GET', url: `${endpoint}?userId=${owner}`}).flush([notification]);
    const markRead = http.expectOne({method: 'POST', url: `${endpoint}/read?userId=${owner}`});
    expect(store.state().notifications[0].read).toBeFalse();
    expect(store.state().unreadCount).toBe(1);
    markRead.flush(null, {status: 204, statusText: 'No Content'});
    http.expectOne(`${endpoint}/unread-count?userId=${owner}`).flush({unreadCount: 0});
    expect(store.state().notifications[0].read).toBeTrue();
    expect(store.state().unreadCount).toBe(0);
    currentUser.set(null);
    TestBed.tick();
    tick(30_000);
  }));

  it('clears the previous account and cancels a pending list when the session changes', fakeAsync(() => {
    const store = TestBed.inject(NotificationBellStore);
    signIn(owner);
    http.expectOne(`${endpoint}/unread-count?userId=${owner}`).flush({unreadCount: 4});
    store.load();
    const oldList = http.expectOne(`${endpoint}?userId=${owner}`);

    currentUser.set({id: otherUser, token: 'other-token'});
    expect(store.state().unreadCount).toBe(0);
    TestBed.tick();
    tick();
    expect(oldList.cancelled).toBeTrue();
    http.expectOne(`${endpoint}/unread-count?userId=${otherUser}`).flush({unreadCount: 2});
    expect(store.state().notifications).toEqual([]);
    expect(store.state().unreadCount).toBe(2);
    currentUser.set(null);
    TestBed.tick();
    tick(30_000);
  }));
});
