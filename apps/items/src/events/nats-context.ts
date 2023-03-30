import nats, { Stan } from "node-nats-streaming";

class NatsContext {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error("NATS not connecteds");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url: url });

    process.on("SIGINT", () => this.client.close());
    process.on("SIGTERM", () => this.client.close());

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("NATS connected");
        resolve();
      });
      this.client.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export const natsContext = new NatsContext();
