import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { IMonth, IPayment } from '../interfaces/interfaces';
import { MONTHS } from '../constants/constants';

describe('ApiService', () => {
  let service: ApiService;
  const testList: IPayment[] = [
    {
      id: 1,
      title: 'test-1',
      dayCost: 10,
      months: MONTHS.map((month: IMonth) => {
        return {...month, checked: false};
      })
    },
    {
      id: 2,
      title: 'test-2',
      dayCost: 15,
      months: MONTHS.map((month: IMonth) => {
        return {...month, checked: false};
      })
    }
  ];

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ ApiService ]
  }));

  beforeEach(() => {
    service = TestBed.get(ApiService);
    service['paymentsList'] = [...testList];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of values', done => {
    service.getList().subscribe((result: IPayment[]) => {
      expect(result).toEqual(testList);
      done();
    });
  });

  it('should add payment with right data', done => {
    const spy = spyOn(ApiService, 'newPayment').and.callThrough();
    const request = { title: 'test-3', dayCost: 5 };

    service.addPayment(request)
      .subscribe((result: string) => {
        expect(result).toBe('ok');
        expect(service['paymentsList'].length).toBe(3);
        expect(service['paymentsList'][2].title).toBe('test-3');
        expect(spy).toHaveBeenCalledWith(request, 3);
        done();
      });
  });

  it('should remove payment', done => {
    service.removePayment(2).subscribe((result: string) => {
      expect(result).toBe('ok');
      expect(service['paymentsList'].length).toBe(1);
      expect(service['paymentsList'][0].id).not.toBe(2);
      done();
    });
  });
});
