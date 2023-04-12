import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@nightwood/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
