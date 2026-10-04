import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelLoadRequestDialog } from './cancel-load-request-dialog';

describe('CancelLoadRequestDialog', () => {
  let component: CancelLoadRequestDialog;
  let fixture: ComponentFixture<CancelLoadRequestDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelLoadRequestDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelLoadRequestDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
