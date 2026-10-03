import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadRequestPublishedDialog } from './load-request-published-dialog';

describe('LoadRequestPublishedDialog', () => {
  let component: LoadRequestPublishedDialog;
  let fixture: ComponentFixture<LoadRequestPublishedDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRequestPublishedDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRequestPublishedDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
