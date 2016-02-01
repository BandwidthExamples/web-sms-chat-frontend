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
  messageStore: MessageStore;
  messages: any;//Promise<Message[]>;
  
  constructor(messageStore: MessageStore) {
    this.messageStore = messageStore;
    this.messages = messageStore.getMessages();
  }
}
