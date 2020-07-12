import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { PaymentComponent } from './components/payment/payment.component';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, PaymentComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ ApiService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(comp).toBeTruthy();
  });

  it('should correctly validate form', () => {
    expect(comp.addForm.invalid).toBeTruthy();

    comp.addForm.get('title').setValue('test value');
    expect(comp.addForm.valid).toBeTruthy();

    comp.addForm.get('dayCost').setValue(-1);
    expect(comp.addForm.invalid).toBeTruthy();

    comp.addForm.get('dayCost').setValue(0);
    expect(comp.addForm.invalid).toBeTruthy();

    comp.addForm.get('dayCost').setValue(10);
    expect(comp.addForm.valid).toBeTruthy();
  });

  it('should call addPayment method after add button click', () => {
    comp.addForm.get('title').setValue('test title');
    fixture.detectChanges();
    const addBtnEl = fixture.debugElement.query(By.css('button')).nativeElement;

    const spy = spyOn(comp, 'addPayment').and.callThrough();
    addBtnEl.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should call service add methods', () => {
    const service = TestBed.get(ApiService);
    const addPaymentSpy = spyOn(service, 'addPayment').and.callThrough();
    comp.addForm.get('title').setValue('test');

    comp.addPayment();
    expect(addPaymentSpy).toHaveBeenCalledWith({title: 'test', dayCost: null});
  });

  it('should call getPayments', fakeAsync(() => {
    const getPaymentsSpy = spyOn(comp, 'getPayments').and.callThrough();
    comp.addForm.get('title').setValue('test');

    comp.addPayment();
    expect(getPaymentsSpy).toHaveBeenCalled();
    expect(comp.addForm.value).toEqual({title: null, dayCost: null});
  }));

  it('should reset adding form', () => {
    comp.addForm.get('title').setValue('test');
    comp.addPayment();
    expect(comp.addForm.value).toEqual({title: null, dayCost: null});
  });

  it('should call getList of service', () => {
    const service = TestBed.get(ApiService);
    const getListSpy = spyOn(service, 'getList').and.callThrough();

    comp.getPayments();
    expect(getListSpy).toHaveBeenCalled();
  });

  it('should calc totalCost', fakeAsync(() => {
    fixture.detectChanges();
    expect(comp.totalCost).toBe(0);
    comp.form.addControl('1', new FormControl(10));
    comp.form.addControl('2', new FormControl(20));
    fixture.detectChanges();
    tick(1);
    expect(comp.totalCost).toBe(30);
  }));

  it('should display payments array', fakeAsync(() => {
    comp.addForm.setValue({title: 'test-1', dayCost: 1});
    comp.addPayment();
    comp.addForm.setValue({title: 'test-2', dayCost: 2});
    comp.addPayment();
    fixture.detectChanges();
    const paymentsEls = fixture.debugElement.queryAll(By.css('[app-payment]'));
    expect(paymentsEls.length).toBe(2);
  }));
});
