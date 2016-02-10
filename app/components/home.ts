import {Component, Injector, Pipe, PipeTransform, OnDestroy } from "angular2/core";
import {CanActivate} from "angular2/router";
import {FORM_DIRECTIVES} from 'angular2/common';
import {AuthProvider} from "../services/auth";
import {Store, Contact, Message, UserData} from "../services/store";
import {Transport} from "../services/transport";
import {MessagesView} from "./messages";



@Component({
  selector: "home",
  directives: [FORM_DIRECTIVES, MessagesView],
  templateUrl: "app/components/home.html"
})
@CanActivate((next, previous) => {
  return AuthProvider.appInstance.checkIfAuthentificated();
})
export class HomeView implements OnDestroy {
  contacts: Contact[];
  messages: Message[] = new Array<Message>();
  newContact: Contact = <Contact>{};
  newMessage: Message = <Message>{};
  userData: UserData;
  subscription: any;
  areMessagesLoading: boolean = false;
  
  constructor(private store: Store, transport: Transport) {
    this.areMessagesLoading = true;
    store.getMessages().then((messages) => {
      this.messages = messages;
      this.areMessagesLoading = false;
    });
    this.userData = store.getUserData();
    let contacts = this.contacts = store.getContacts();
    this.getContactName = (phoneNumber) => {
      let contact = <Contact>(contacts.filter((c)=>c.phoneNumber == phoneNumber)[0] || {});
      return contact.name;
    };
    
    this.selectContact = (phoneNumber) =>{
      for(let c of contacts){
        (<any>c).selected = false;  
      }
      let contact = <Contact>contacts.filter((c)=>c.phoneNumber == phoneNumber)[0];
      if(!contact){
        contact = <Contact>{
          name: phoneNumber,
          phoneNumber: phoneNumber
        };
        store.addContact(contact);
      }
      (<any>contact).selected = true;
    };
    
    //handle incoming messages (and state of sent messages)
    this.subscription = transport.dataReceived.subscribe(ev => {
       if(ev.eventName == "message"){
         let message = <Message>ev.data;
         let existingMessage = this.messages.filter(m=>m.messageId == message.messageId)[0];
         if(existingMessage){
           existingMessage.state = message.state; //update state of exiting message
         }
         else{
           this.messages.unshift(message);
         }
       }
    });
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
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
  selectContact: (phoneNumber: string) => void;
  
  sendMessage(){
    this.newMessage.to = this.selectedContacts[0].phoneNumber  
    this.store.addMessage(this.newMessage).then(message=>{
      this.messages.unshift(message);
      this.newMessage = <Message>{};
    });
    //TODO handle success/error
  }
}