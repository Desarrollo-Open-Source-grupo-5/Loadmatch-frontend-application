import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationStatusChip } from './validation-status-chip';

describe('ValidationStatusChip', () => {
  let component: ValidationStatusChip;
  let fixture: ComponentFixture<ValidationStatusChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationStatusChip],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationStatusChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
