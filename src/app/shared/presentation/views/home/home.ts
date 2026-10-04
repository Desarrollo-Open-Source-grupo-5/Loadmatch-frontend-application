import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ProfileChooser} from '../../../../profiles/presentation/components/profile-chooser/profile-chooser';

/**
 * Home view: welcome message and the demo profile chooser.
 */
@Component({
  imports: [
    TranslatePipe,
    ProfileChooser
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
