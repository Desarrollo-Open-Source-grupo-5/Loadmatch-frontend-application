import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadRequestForm } from './load-request-form';

describe('LoadRequestForm', () => {
  let component: LoadRequestForm;
  let fixture: ComponentFixture<LoadRequestForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRequestForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRequestForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
