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
    let contacts = this.contacts = store.getContacts();
    this.getContactName = ((phoneNumber) => {
      let contact = <Contact>(contacts.filter((c)=>c.phoneNumber == phoneNumber)[0] || {});
      return contact.name;
    });
  }
  
  addContact(data){
    this.store.addContact(data);
  }
  
  removeContact(data, index){
    this.store.removeContact(index);
  }
  
  get selectedContacts(): Contact[]{
    return this.contacts.filter((c) => (<any>c).selected);
  }
  
  getContactName: (phoneNumber: string) => string;
}