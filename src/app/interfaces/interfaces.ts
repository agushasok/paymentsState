export interface IPayment {
  id: number;
  title: string;
  dayCost: number;
  months: IMonth[];
}

export interface IMonth {
  systemName: string;
  days: number;
  title: string;
  checked?: boolean;
}

export interface IAddPaymentRequest {
  title: string;
  dayCost: number;
}
