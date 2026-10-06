import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentValidationStatus } from './document-validation-status';

describe('DocumentValidationStatus', () => {
  let component: DocumentValidationStatus;
  let fixture: ComponentFixture<DocumentValidationStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentValidationStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentValidationStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
