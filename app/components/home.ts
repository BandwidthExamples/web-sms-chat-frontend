import {Component, Injector} from "angular2/core";
import {CanActivate} from "angular2/router";
import {FORM_DIRECTIVES} from 'angular2/common';
import {AuthProvider} from "../services/auth";
import {Store, Contact, Message} from "../services/store";
import {MessagesView} from "./messages";

@Component({
  selector: "home",
  directives: [FORM_DIRECTIVES, MessagesView],
  templateUrl: "app/components/home.html"
})
@CanActivate((next, previous) => {
  return AuthProvider.appInstance.checkIfAuthentificated();
})
export class HomeView {
  contacts: Contact[];
  messages: Promise<Message[]>;
  
  constructor(private store: Store) {
    this.messages = store.getMessages();
    this.contacts = store.getContacts();
  }
  
  addContact(data){
    this.resetTemporaryProperties();
    this.store.addContact(data);
  }
  
  removeContact(data, index){
    this.resetTemporaryProperties();
    this.store.removeContact(index);
  }
  
  get selectedContacts(): Contact[]{
    return this.contacts.filter((c) => (<any>c).selected);
  }
  
  private resetTemporaryProperties(): void{
    for(let c of this.contacts){
      delete (<any>c).removeContactVisible;
      delete (<any>c).selected;
    }
  }
}