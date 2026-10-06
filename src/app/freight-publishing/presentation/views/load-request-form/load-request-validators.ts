import {AbstractControl, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/**
 * Validators of the publish load request form.
 */
export class LoadRequestValidators {

  /**
   * Requires a number strictly greater than zero.
   * @returns Validator that sets the `positive` error.
   */
  static positive(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return Number(value) > 0 ? null : {positive: true};
    };
  }

  /**
   * Group validator that requires different origin and destination locations.
   * @param originControlName - Name of the origin location control.
   * @param destinationControlName - Name of the destination location control.
   * @returns Validator that sets the `sameLocation` error on the group.
   */
  static differentLocations(originControlName: string, destinationControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const origin = group.get(originControlName)?.value;
      const destination = group.get(destinationControlName)?.value;
      return origin && destination && origin === destination ? {sameLocation: true} : null;
    };
  }

  /**
   * Group validator that keeps the weight within the capacity of the selected vehicle type.
   * @param weightControlName - Name of the weight control (kg).
   * @param vehicleTypeControlName - Name of the vehicle type control.
   * @param maxWeightFor - Returns the maximum weight of a vehicle type, or undefined if unknown.
   * @returns Validator that sets `weightExceedsCapacity: { maxWeightKg }` on the group.
   */
  static weightWithinVehicleCapacity(
    weightControlName: string,
    vehicleTypeControlName: string,
    maxWeightFor: (vehicleTypeId: number) => number | undefined
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const weight = group.get(weightControlName)?.value;
      const vehicleTypeId = group.get(vehicleTypeControlName)?.value;
      if (weight === null || weight === undefined || weight === '' || vehicleTypeId === null || vehicleTypeId === undefined) {
        return null;
      }
      const maxWeightKg = maxWeightFor(Number(vehicleTypeId));
      return maxWeightKg !== undefined && Number(weight) > maxWeightKg ? {weightExceedsCapacity: {maxWeightKg}} : null;
    };
  }

  /**
   * Group validator that requires the pickup date and time to be in the future.
   * @param dateControlName - Name of the pickup date control (Date).
   * @param timeControlName - Name of the pickup time control (`HH:mm`).
   * @param now - Clock, injectable for tests.
   * @returns Validator that sets the `pickupInPast` error on the group.
   */
  static pickupInFuture(dateControlName: string, timeControlName: string, now: () => Date = () => new Date()): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const date = group.get(dateControlName)?.value;
      const time = group.get(timeControlName)?.value;
      if (!(date instanceof Date) || !time) {
        return null;
      }
      const pickupAt = LoadRequestValidators.combineDateAndTime(date, time);
      return pickupAt.getTime() > now().getTime() ? null : {pickupInPast: true};
    };
  }

  /**
   * Combines a calendar date and a `HH:mm` time into a single local date.
   * @param date - Calendar date.
   * @param time - Time of day in `HH:mm` format.
   * @returns Date with the given day and time.
   */
  static combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours || 0, minutes || 0);
  }
}

/**
 * Shows a field in error state when the field itself is invalid or when its form group has the given cross-field
 * error, once the field was touched or the form was submitted.
 */
export class CrossFieldErrorStateMatcher implements ErrorStateMatcher {

  /**
   * Creates a matcher for a group-level error.
   * @param groupErrorKey - Error key set by a group validator (e.g. `sameLocation`).
   */
  constructor(private readonly groupErrorKey: string) {}

  /**
   * Decides whether the field shows its error state.
   * @param control - Field control.
   * @param form - Parent form directive.
   * @returns True when the error must be displayed.
   */
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control) {
      return false;
    }
    const invalid = control.invalid || !!control.parent?.hasError(this.groupErrorKey);
    return invalid && (control.touched || !!form?.submitted);
  }
}
