import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAddPaymentRequest, IMonth, IPayment } from '../interfaces/interfaces';
import { MONTHS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Список платежей
  private paymentsList: IPayment[] = [];

  // Создать платёж
  public static newPayment(data: IAddPaymentRequest, id: number): IPayment {
    const monthsArray: IMonth[] = MONTHS.map((month: IMonth) => {
      return {...month, checked: false};
    });

    return {
      id: id,
      title: data.title,
      dayCost: data.dayCost || 1,
      months: monthsArray
    };
  }

  // Вернуть список платежей
  public getList(): Observable<IPayment[]> {
    return of(this.paymentsList);
  }

  // Добавить новый платёж
  public addPayment(request: IAddPaymentRequest): Observable<string> {
    const id = Math.max(...this.paymentsList.map((item: IPayment) => item.id), 0) + 1;
    const payment = ApiService.newPayment(request, id);
    this.paymentsList.push(payment);

    return of('ok');
  }

  // Удалить платёж
  public removePayment(id: number): Observable<string> {
    this.paymentsList.splice(this.paymentsList.findIndex((item: IPayment) => item.id === id), 1);

    return of('ok');
  }
}
