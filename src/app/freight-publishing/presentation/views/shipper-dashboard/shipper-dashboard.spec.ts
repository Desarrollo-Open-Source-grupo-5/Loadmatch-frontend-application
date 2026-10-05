import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipperDashboard } from './shipper-dashboard';

describe('ShipperDashboard', () => {
  let component: ShipperDashboard;
  let fixture: ComponentFixture<ShipperDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipperDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipperDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
