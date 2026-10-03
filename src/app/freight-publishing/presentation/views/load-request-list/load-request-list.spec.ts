import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadRequestList } from './load-request-list';

describe('LoadRequestList', () => {
  let component: LoadRequestList;
  let fixture: ComponentFixture<LoadRequestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRequestList],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRequestList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
