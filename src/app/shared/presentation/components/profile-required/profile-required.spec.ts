import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileRequired } from './profile-required';

describe('ProfileRequired', () => {
  let component: ProfileRequired;
  let fixture: ComponentFixture<ProfileRequired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRequired],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRequired);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
