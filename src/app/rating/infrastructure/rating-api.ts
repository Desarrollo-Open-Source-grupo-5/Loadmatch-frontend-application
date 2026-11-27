import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {RatingEntity, RegisterRatingRequest} from '../domain/model/rating.entity';

/**
 * HTTP client for rating endpoints.
 */
@Injectable({providedIn: 'root'})
export class RatingApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/ratings`;

  registerRating(request: RegisterRatingRequest): Observable<RatingEntity> {
    return this.http.post<RatingEntity>(this.baseUrl, request);
  }

  getRatingsByRatee(rateeId: string): Observable<RatingEntity[]> {
    return this.http.get<RatingEntity[]>(this.baseUrl, {params: {rateeId}});
  }
}

