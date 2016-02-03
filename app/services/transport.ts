export class Transport {
  
  public authData: AuthData;
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket(this.buildWebSocketUrl());
    this.socket.addEventListener("message", (ev) => {
      let eventData = JSON.parse(ev.data);
      let subscribers = this.subscribers[eventData.eventName];
      if (!subscribers) {
        return;
      }
      subscribers.forEach((handler) => handler(eventData.eventName, eventData.data));
    });
    this.socket.addEventListener("error", (ev) => {
      console.error(ev.error);
      //TODO handle this error
    });
    this.socket.addEventListener("close", (ev) => {
      console.error(`WebSocket connection has benn closed with code ${ev.code}`);
    });
  }
  
  
  send(command: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = Math.random();
      const successEventName = `${command}.success.${id}`;
      const errorEventName = `${command}.error.${id}`;
      let resetHandlers = () => {
        this.unsubscribe(successEventName, successHandler);
        this.unsubscribe(errorEventName, errorHandler);
      };
      let successHandler = (eventName: string, data: any) => {
        resetHandlers();
        isCompleted = true;
        resolve(data);
      };
      let errorHandler = (eventName: string, data: any) => {
        resetHandlers();
        isCompleted = true;
        reject(data);
      };
      let isCompleted = false;
      this.socket.send(JSON.stringify({
        auth: this.authData,
        command: command,
        data: data,
        id: id
      }));
      setTimeout(() => {
        if (!isCompleted) {
          resetHandlers();
          reject(new Error("Timeout"));
        }
      }, 60000); // timeout 60 seconds per command
    });
  }

  private subscribers: { [id: string]: Set<(eventName: string, data: any) => void>; };

  subscribe(eventName: string, handler: (eventName: string, data: any) => void): void {
    let set = this.subscribers[eventName] || new Set<(eventName: string, data: any) => void>();
    set.add(handler);
    this.subscribers[eventName] = set;
  }

  unsubscribe(eventName: string, handler: (eventName: string, data: any) => void): void {
    let set = this.subscribers[eventName] || new Set<(eventName: string, data: any) => void>();
    set.delete(handler);
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
