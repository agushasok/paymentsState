import { IAddPaymentRequest, IPayment } from '../interfaces/interfaces';
import { MONTHS } from '../constants/constants';

export class Payment {

  constructor(
    private data: IAddPaymentRequest,
    private id: number
  ) {
  }

  public get payment(): IPayment {
    const monthsArray = Object.keys(MONTHS).map(month => {
      return {[month]: false};
    });

    return {
      id: this.id,
      title: this.data.title,
      dayCost: this.data.dayCost,
      months: monthsArray.reduce((acc, month): any => {
        return Object.assign(acc, month);
      }, {})
    };
  }
}
