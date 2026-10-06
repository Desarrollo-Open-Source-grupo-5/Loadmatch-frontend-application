import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {AvailableLoad} from '../../../domain/model/available-load';

/**
 * Card that summarizes an {@link AvailableLoad} in the search results and links to its detail.
 */
@Component({
  imports: [RouterLink, MatCard, MatCardContent, MatCardActions, MatButton, MatIcon, TranslatePipe, LocalizedDatePipe, LocalizedNumberPipe, MoneyPipe],
  selector: 'app-available-load-card',
  styleUrl: './available-load-card.css',
  templateUrl: './available-load-card.html',
})
export class AvailableLoadCard {
  /**
   * Load to display.
   */
  readonly load = input.required<AvailableLoad>();

  /**
   * Name of the vehicle type required by the load.
   */
  readonly vehicleTypeName = input<string>('');
}
