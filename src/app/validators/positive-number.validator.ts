import { FormControl } from '@angular/forms';

// Валидатор положительности числа
export function positiveValidator(control: FormControl): {[error: string]: boolean} | null {
  if (control && (control.value && control.value > 0 || control.value === null)) {
    return null;
  }

  return { nonPositive: true };
}
