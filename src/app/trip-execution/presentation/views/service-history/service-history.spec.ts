import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceHistory } from './service-history';

describe('ServiceHistory', () => {
  let component: ServiceHistory;
  let fixture: ComponentFixture<ServiceHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
