export interface ReservationPaymentAvailability {
  isAvailabilityPayment: boolean;
  reservationCode: string;
  tripId: string;
}

export interface ReservationPaymentRetrieve {
  paymentGatewayUrl: string;
}
