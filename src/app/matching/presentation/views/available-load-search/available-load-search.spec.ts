import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableLoadSearch } from './available-load-search';

describe('AvailableLoadSearch', () => {
  let component: AvailableLoadSearch;
  let fixture: ComponentFixture<AvailableLoadSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableLoadSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableLoadSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
