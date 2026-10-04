import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableLoadDetail } from './available-load-detail';

describe('AvailableLoadDetail', () => {
  let component: AvailableLoadDetail;
  let fixture: ComponentFixture<AvailableLoadDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableLoadDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableLoadDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
