import {Component} from "angular2/core";
import {MessageStore, Message} from './services/store';

@Component({
    selector: "sms-app",
    templateUrl: "app/app.html",
    providers: [MessageStore]
})
export class SmsApp { 
  messageStore: MessageStore;
  messages: Promise<Message[]>;
  
  constructor(messageStore: MessageStore) {
    this.messageStore = messageStore;
    this.messages = messageStore.getMessages();
  }
  
}
