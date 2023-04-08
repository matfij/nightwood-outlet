import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(protected client: Stan, private enableLogs = false) {}

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          if (this.enableLogs) {
            console.log(`Message publish error: ${this.subject} (error)`);
          }
          reject(error);
        }
        if (this.enableLogs) {
          console.log(`Message published: ${this.subject}`);
        }
        resolve();
      });
    });
  }
}
