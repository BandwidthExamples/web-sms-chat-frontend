import {Component} from "angular2/core";
import {MessageStore, Message} from './services/store';
import {MessagesView} from './directives/messages';


@Component({
    selector: "sms-app",
    templateUrl: "app/app.html",
    directives: [MessagesView],
    providers: [MessageStore]
})
export class SmsApp { 
  messages: Promise<Message[]>;
  
  constructor(private messageStore: MessageStore) {
    this.messages = messageStore.getMessages();
  }
}
