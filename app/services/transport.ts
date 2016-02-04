import {EventEmitter} from "angular2/core";

export class Transport {
  
  public authData: AuthData;
  private socket: WebSocket;
  
  dataReceived: EventEmitter<DataReceivedEvent> = new EventEmitter();

  constructor() {
    /*this.socket = new WebSocket(this.buildWebSocketUrl());
    this.socket.addEventListener("message", (ev) => {
      let eventData = JSON.parse(ev.data);
      this.dataReceived.emit(eventData);
    });
    this.socket.addEventListener("error", (ev) => {
      console.error(ev.message);
      //TODO handle this error
    });
    this.socket.addEventListener("close", (ev) => {
      console.error(`WebSocket connection has been closed with code ${ev.code}`);
    });*/
  }
  
  
  send(command: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = Math.random();
      const successEventName = `${command}.success.${id}`;
      const errorEventName = `${command}.error.${id}`;
      
      let isCompleted = false;
      let handler = (ev: DataReceivedEvent) => {
        if(ev.eventName != successEventName && ev.eventName != errorEventName){
          return;
        }
        this.dataReceived.remove(handler);
        isCompleted = true;
        if(ev.eventName == successEventName){
          resolve(ev.data);  
        }
        else{
          reject(ev.data);  
        }
      };
      this.dataReceived.add(handler);
      this.socket.send(JSON.stringify({
        auth: this.authData,
        command: command,
        data: data,
        id: id
      }));
      setTimeout(() => {
        if (!isCompleted) {
          this.dataReceived.remove(handler);
          reject(new Error("Timeout"));
        }
      }, 60000); // timeout 60 seconds per command
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

export interface DataReceivedEvent{
  eventName: string,
  data: any
}
