import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export function minLengthArray(min: number) {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c instanceof FormArray) {
      return c.length >= min ? null : { required: true };
    }
    return null;
  };
}
