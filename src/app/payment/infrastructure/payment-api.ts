import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CreatePaymentRequest, PaymentEntity} from '../domain/model/payment.entity';

/**
 * HTTP client for payment endpoints.
 */
@Injectable({providedIn: 'root'})
export class PaymentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/payments`;

  createPayment(request: CreatePaymentRequest): Observable<PaymentEntity> {
    return this.http.post<PaymentEntity>(this.baseUrl, request);
  }

  getPaymentsByTripId(tripId: string): Observable<PaymentEntity[]> {
    return this.http.get<PaymentEntity[]>(this.baseUrl, {params: {tripId}});
  }
}

