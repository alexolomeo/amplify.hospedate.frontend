export interface Rating {
  score: number;
  overallRating: OverallRating[];
  ratingCategories: RatingCategory;
}
export interface OverallRating {
  score: number;
  count: number;
}
export interface RatingCategory {
  cleanliness: number;
  accuracy: number;
  checkIn: number;
  communication: number;
  location: number;
  value: number;
}
