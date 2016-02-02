import {Component} from "angular2/core";
import {MessageStore, Message} from './services/store';
import {Transport} from './services/transport';
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
    //Transport.getInstance();
    this.messages = messageStore.getMessages();
  }
}
