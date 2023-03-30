import { ItemCreatedEvent, Publisher, Subjects } from "@nightwood/common";

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
}
