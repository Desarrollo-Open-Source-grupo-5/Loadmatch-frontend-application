import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripStatusChip } from './trip-status-chip';

describe('TripStatusChip', () => {
  let component: TripStatusChip;
  let fixture: ComponentFixture<TripStatusChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStatusChip],
    }).compileComponents();

    fixture = TestBed.createComponent(TripStatusChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
