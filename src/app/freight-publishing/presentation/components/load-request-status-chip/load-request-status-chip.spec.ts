import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadRequestStatusChip } from './load-request-status-chip';

describe('LoadRequestStatusChip', () => {
  let component: LoadRequestStatusChip;
  let fixture: ComponentFixture<LoadRequestStatusChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRequestStatusChip],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRequestStatusChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
