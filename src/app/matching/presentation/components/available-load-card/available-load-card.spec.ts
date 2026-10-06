import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableLoadCard } from './available-load-card';

describe('AvailableLoadCard', () => {
  let component: AvailableLoadCard;
  let fixture: ComponentFixture<AvailableLoadCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableLoadCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableLoadCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
