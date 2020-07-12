import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { MONTHS } from './constants/constants';
import { IMonth, IPayment } from './interfaces/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { positiveValidator } from './validators/positive-number.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private readonly apiService: ApiService) {
    this.getPayments = this.getPayments.bind(this);
  }

  // Список месяцев
  public months: IMonth[] = MONTHS;

  // Список платежей
  public payments: IPayment[] = [];

  // Общая цена
  public totalCost = 0;

  // Форма добавления платежа
  public addForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    dayCost: new FormControl(null, [positiveValidator])
  });

  // Форма с платежами
  public form = new FormGroup({});

  // Подписки компонента
  private subscriptions: Subscription = new Subscription();

  // Получит список платежей
  public getPayments() {
    this.subscriptions.add(
      this.apiService.getList().subscribe(data => {
        this.payments = data;
        data.forEach(payment => {
          this.form.addControl(`${payment.id}`, new FormControl(payment));
        });
      })
    );
  }

  // Добавление платежа
  public addPayment() {
    this.subscriptions.add(
      this.apiService.addPayment(this.addForm.value).subscribe(this.getPayments)
    );
    this.addForm.reset();
  }

  // Удаление платежа
  public deletePayment(id: string): void {
    this.form.removeControl(id);
    this.subscriptions.add(
      this.apiService.removePayment(+id).subscribe(this.getPayments)
    );
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form.valueChanges.subscribe((value: { [key: string]: number }) => {
        this.totalCost = Object.keys(value)
          .reduce((acc, key) => acc + (typeof value[key] === 'number' ? value[key] : 0), 0);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
