import { ItemUpdatedEvent, Publisher, Subjects } from "@nightwood/common";

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
}
