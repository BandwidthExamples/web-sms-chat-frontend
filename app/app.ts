import {Component} from "angular2/core";
import {MessageStore, Message} from './services/store';

@Component({
    selector: "sms-app",
    templateUrl: "app/app.html"
})
export class SmsApp { 
  messageStore: MessageStore;
  
  constructor(messageStore: MessageStore) {
    this.messageStore = messageStore;
  }
}
