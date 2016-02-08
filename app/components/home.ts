import {Component, Injector, Pipe, PipeTransform} from "angular2/core";
import {CanActivate} from "angular2/router";
import {FORM_DIRECTIVES} from 'angular2/common';
import {AuthProvider} from "../services/auth";
import {Store, Contact, Message} from "../services/store";
import {MessagesView} from "./messages";

/*
 Pipe `avoidAngularBug` was created to avoid angular2.beta2 bug with throwing in dev mode an exception "EXCEPTION: Expression XXXXXX has changed after it was checked".
 https://github.com/angular/angular/issues/5950
 Please remove it after angular2 released.   
*/
@Pipe({
  name: "avoidAngularBug"
})
class AvoidAngularBugPipe implements PipeTransform {
  private items: Array<any> = new Array<any>();
  transform(value: Array<any>, args: any[]) {
    this.items.splice(0, this.items.length);
    for(let item of value){
      this.items.push(item);
    }
    return this.items; //we should return same object to avoid an exception
  }
}


@Component({
  selector: "home",
  directives: [FORM_DIRECTIVES, MessagesView],
  pipes: [AvoidAngularBugPipe],
  templateUrl: "app/components/home.html"
})
@CanActivate((next, previous) => {
  return AuthProvider.appInstance.checkIfAuthentificated();
})
export class HomeView {
  contacts: Contact[];
  messages: Message[] = new Array<Message>();
  newContact: Contact = <Contact>{};
  
  constructor(private store: Store) {
    store.getMessages().then((messages) => this.messages = messages );
    let contacts = this.contacts = store.getContacts();
    this.getContactName = ((phoneNumber) => {
      let contact = <Contact>(contacts.filter((c)=>c.phoneNumber == phoneNumber)[0] || {});
      return contact.name;
    });
  }
  
  addContact(){
    this.store.addContact(this.newContact);
  }
  
  removeContact(data, index){
    this.store.removeContact(index);
  }
  
  get selectedContacts(): Contact[]{
    return this.contacts.filter((c) => (<any>c).selected);
  }
  
  get messagesToShow(): Message[]{
    let selectedNumbers = this.selectedContacts.map(c => c.phoneNumber);
    if(selectedNumbers.length == 0 || selectedNumbers.length == this.contacts.length){ //show all messages if selected all or none contacts
      return this.messages;
    }
    return this.messages.filter((m) => {
      return selectedNumbers.indexOf(m.from) >= 0 || selectedNumbers.indexOf(m.to) >= 0; 
    });
  }
  
  getContactName: (phoneNumber: string) => string;
}