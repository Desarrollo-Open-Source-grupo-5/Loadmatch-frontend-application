import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrierTrips } from './carrier-trips';

describe('CarrierTrips', () => {
  let component: CarrierTrips;
  let fixture: ComponentFixture<CarrierTrips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrierTrips],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrierTrips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
