import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * About view: what LoadMatch is and who builds it.
 */
@Component({
  imports: [
    TranslatePipe
  ],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {}
