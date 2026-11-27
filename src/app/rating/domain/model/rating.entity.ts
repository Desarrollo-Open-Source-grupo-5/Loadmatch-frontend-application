export type RaterType = 'SHIPPER' | 'CARRIER';

export interface RatingEntity {
  id: string;
  tripId: string;
  raterId: string;
  rateeId: string;
  raterType: RaterType;
  score: number;
  comment?: string;
}

export interface RegisterRatingRequest {
  tripId: string;
  raterId: string;
  raterType: RaterType;
  score: number;
  comment?: string;
}

