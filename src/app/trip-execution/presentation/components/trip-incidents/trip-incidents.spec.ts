import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatSelectHarness} from '@angular/material/select/testing';
import {By} from '@angular/platform-browser';
import {provideTranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {TripIncidentsService} from '../../../application/trip-incidents.service';
import {TripIncident} from '../../../domain/model/trip-incident';
import {TripIncidents} from './trip-incidents';

describe('TripIncidents', () => {
  const incident: TripIncident = {
    id: 'incident-1',
    type: 'ACCIDENT',
    description: 'Road closed',
    evidenceUrl: '/api/v1/trips/trip-1/incidents/incident-1/evidence',
    reportedAt: new Date('2026-11-27T09:00:00')
  };
  let fixture: ComponentFixture<TripIncidents>;
  let service: jasmine.SpyObj<TripIncidentsService>;

  beforeEach(() => {
    service = jasmine.createSpyObj<TripIncidentsService>('TripIncidentsService', ['list', 'report']);
    service.list.and.returnValue(of([incident]));
    service.report.and.returnValue(of(incident));
    TestBed.configureTestingModule({
      imports: [TripIncidents],
      providers: [provideTranslateService(), {provide: TripIncidentsService, useValue: service}]
    });
    fixture = TestBed.createComponent(TripIncidents);
    fixture.componentRef.setInput('tripId', 'trip-1');
  });

  function openPanel(canReport: boolean): HTMLElement {
    fixture.componentRef.setInput('canReport', canReport);
    fixture.detectChanges();
    fixture.debugElement.query(By.directive(MatExpansionPanel)).componentInstance.open();
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('shows the incident history without the report form in read-only mode', () => {
    const view = openPanel(false);
    expect(service.list).toHaveBeenCalledOnceWith('trip-1');
    expect(view.textContent).toContain('Road closed');
    expect(view.querySelector('button[mat-stroked-button]')).toBeNull();
  });

  it('requires a photo and notifies the carrier view after a successful report', async () => {
    const view = openPanel(true);
    const reported = jasmine.createSpy('reported');
    fixture.componentInstance.incidentReported.subscribe(reported);
    view.querySelector<HTMLButtonElement>('button[mat-stroked-button]')!.click();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({text: 'trip-incidents.type.ACCIDENT'});
    const submit = view.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(submit.disabled).toBeTrue();

    const input = view.querySelector<HTMLInputElement>('input[type="file"]')!;
    const invalid = new DataTransfer();
    invalid.items.add(new File(['example'], 'evidence.pdf', {type: 'application/pdf'}));
    input.files = invalid.files;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(submit.disabled).toBeTrue();
    expect(view.textContent).toContain('trip-incidents.evidence-type-error');

    const valid = new DataTransfer();
    const photo = new File([Uint8Array.of(0xff, 0xd8, 0xff)], 'photo.jpg', {type: 'image/jpeg'});
    valid.items.add(photo);
    input.files = valid.files;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(submit.disabled).toBeFalse();
    submit.click();

    expect(service.report).toHaveBeenCalledOnceWith('trip-1', 'ACCIDENT', '', photo);
    expect(reported).toHaveBeenCalledTimes(1);
  });
});
