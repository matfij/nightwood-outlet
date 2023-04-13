export interface PaymentCreatedEvent {
  id: string;
  orderId: string;
  chargeId: string;
  version: number;
}
