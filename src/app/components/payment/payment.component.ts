import { Component, EventEmitter, forwardRef, OnDestroy, OnInit, Output } from '@angular/core';
import { IMonth, IPayment } from '../../interfaces/interfaces';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MONTHS } from '../../constants/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-payment]',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaymentComponent),
      multi: true,
    },
  ],
})
export class PaymentComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor() {
    this.calcCost = this.calcCost.bind(this);
  }

  // Форма с месяцами
  public form = new FormGroup(MONTHS.reduce((acc, month) => {
    return Object.assign(acc, {[month.systemName]: new FormControl(false)});
  }, {}));

  // Инфо о платеже
  public payment: IPayment;

  // Подписки компонента
  private subscriptions: Subscription = new Subscription();

  // Событие удаления платежа
  @Output() public delete = new EventEmitter<string>();
  public remove(id: number): void {
    this.delete.emit(`${id}`);
  }

  // Расчитать стоимость платежа
  private calcCost(): void {
    const totalCost = Object.keys(this.form.value).reduce((acc: number, key: string) => {
      if (this.form.value[key]) {
        acc += MONTHS.find(month => month.systemName === key).days * this.payment.dayCost;
      }
      return acc;
    }, 0);

    this.onChange(totalCost);
  }

  private onTouched = () => {};

  private onChange: (value: number) => void = () => {};

  public registerOnChange(onChange: (value: number) => void) {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  public writeValue(value: IPayment) {
    this.payment = value;
    this.form.patchValue(value.months.map((month: IMonth) => {
      return {[month.systemName]: month.checked};
    }));
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form.valueChanges.subscribe(this.calcCost)
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
