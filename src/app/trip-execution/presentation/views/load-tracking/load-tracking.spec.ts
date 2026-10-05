import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadTracking } from './load-tracking';

describe('LoadTracking', () => {
  let component: LoadTracking;
  let fixture: ComponentFixture<LoadTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadTracking],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
