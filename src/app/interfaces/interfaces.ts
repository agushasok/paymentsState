export interface IPayment {
  id: number;
  title: string;
  dayCost: number;
  months: {
    [monthName: string]: boolean
  };
}

export interface IAddPaymentRequest {
  title: string;
  dayCost: number;
}
