import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAddPaymentRequest, IPayment } from '../interfaces/interfaces';
import { Payment } from '../classes/classes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private paymentsList: IPayment[] = [];

  public getList(): Observable<IPayment[]> {
    return of(this.paymentsList);
  }

  public addPayment(request: IAddPaymentRequest): Observable<any> {
    const id = Math.max(...this.paymentsList.map(item => item.id), 0) + 1;
    const payment = (new Payment(request, id)).payment;
    this.paymentsList.push(payment);

    return of('ok');
  }

  public removePayment(id: number): Observable<any> {
    this.paymentsList.splice(this.paymentsList.findIndex(item => item.id === id), 1);

    return of('ok');
  }
}
