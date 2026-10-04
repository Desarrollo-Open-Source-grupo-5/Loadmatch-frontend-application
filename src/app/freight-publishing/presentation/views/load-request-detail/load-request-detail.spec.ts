import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadRequestDetail } from './load-request-detail';

describe('LoadRequestDetail', () => {
  let component: LoadRequestDetail;
  let fixture: ComponentFixture<LoadRequestDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRequestDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRequestDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
