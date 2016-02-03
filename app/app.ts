import {Component, provide} from "angular2/core";
import {MessageStore, Message} from './services/store';
import {AuthProvider} from './services/auth';
import {Transport} from './services/transport';
import {MessagesView} from './directives/messages';
import {SignInFormView} from './directives/signInForm';

let transport = new Transport();

@Component({
  selector: "sms-app",
  templateUrl: "app/app.html",
  directives: [MessagesView, SignInFormView],
  providers: [MessageStore, provide(AuthProvider, {useValue: new AuthProvider(transport)}), provide(Transport, {useValue: transport})]
})
export class SmsApp {
  messages: Promise<Message[]>;

  constructor(private messageStore: MessageStore, public authProvider: AuthProvider) {
    if(authProvider.isAuthentificated){
      this.loadData();
    }
  }
  
  loadData(){
    this.messages = this.messageStore.getMessages();
  }
}
