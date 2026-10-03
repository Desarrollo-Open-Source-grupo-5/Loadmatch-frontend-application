import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileChooser } from './profile-chooser';

describe('ProfileChooser', () => {
  let component: ProfileChooser;
  let fixture: ComponentFixture<ProfileChooser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileChooser],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileChooser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
