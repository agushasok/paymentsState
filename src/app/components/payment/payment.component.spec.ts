import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentComponent } from './payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IMonth, IPayment } from '../../interfaces/interfaces';
import { MONTHS } from '../../constants/constants';
import { By } from '@angular/platform-browser';

describe('PaymentComponent', () => {
  let comp: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  let payment: IPayment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    payment = {
      id: 14,
      title: 'test',
      dayCost: 10,
      months: MONTHS.map((month: IMonth) => {
        return {...month, checked: false};
      })
    };

    fixture = TestBed.createComponent(PaymentComponent);
    comp = fixture.componentInstance;
    comp.writeValue(payment);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should payment to be correct', () => {
    expect(comp.payment).toEqual(payment);
  });

  it('should call onChange with correct value', () => {
    const onChangeSpy = spyOn(comp, 'onChange').and.callThrough();
    comp.form.get('apr').setValue(true);
    comp.form.get('aug').setValue(true);
    expect(onChangeSpy).toHaveBeenCalledWith(300);
    expect(onChangeSpy).toHaveBeenCalledWith(610);
    expect(onChangeSpy).toHaveBeenCalledTimes(2);
  });

  it('should call remove on click delete button', () => {
    fixture.detectChanges();
    const deleteSpy = spyOn(comp, 'remove').and.callThrough();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should emit delete after remove call', () => {
    comp.delete.subscribe((id: string) => {
      expect(id).toBe('14');
    });
    comp.remove(14);
  });
});
