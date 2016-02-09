import {EventEmitter} from "angular2/core";

export class Transport {

  commandTimeout: number = 60; //timeout of execution a command in seconds
  authData: AuthData;
  private socket: WebSocket;

  dataReceived: EventEmitter<DataReceivedEvent> = new EventEmitter(true);

  private initSocket(): Promise<void> {
    if (this.socket) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      this.socket = new WebSocket(this.buildWebSocketUrl());
      this.socket.addEventListener("open", (ev) => {
        resolve();
      });
      this.socket.addEventListener("message", (ev) => {
        let eventData = JSON.parse(ev.data);
        this.dataReceived.emit(eventData);
      });
      this.socket.addEventListener("error", (ev) => {
        console.error(ev.message);
        reject(ev.message);
      });
      this.socket.addEventListener("close", (ev) => {
        console.error(`WebSocket connection has been closed with code ${ev.code}`);
        this.socket = null;
      });
    });
  }


  execute(command: string, data: any = null): Promise<any> {
    return this.initSocket().then(()=>{
      return new Promise((resolve, reject) => {
        const id = Math.random();
        const successEventName = `${command}.success.${id}`;
        const errorEventName = `${command}.error.${id}`;

        let isCompleted = false;
        let subscription = this.dataReceived.subscribe((ev: DataReceivedEvent) => {
          if (ev.eventName != successEventName && ev.eventName != errorEventName) {
            return;
          }
          isCompleted = true;
          subscription.unsubscribe();
          if (ev.eventName == successEventName) {
            resolve(ev.data);
          }
          else {
            reject(ev.data);
          }
        })
        this.socket.send(JSON.stringify({
          auth: this.authData,
          command: command,
          data: data,
          id: id
        }));
        setTimeout(() => {
          if (!isCompleted) {
            subscription.unsubscribe();
            reject(new Error("Timeout"));
          }
        }, this.commandTimeout * 1000); // check timeout
      });
    });
  }

  private buildWebSocketUrl(): string {
    let protocol = "ws:"
    if (window.location.protocol == "https:") {
      protocol = "wss:"
    }
    return `${protocol}//${window.location.host}/smschat`;
  }
}

export interface AuthData {
  userId: string;
  apiToken: string;
  apiSecret: string;
}

export interface DataReceivedEvent {
  eventName: string,
  data: any
}
