import {Component, Injector, Pipe, PipeTransform, OnDestroy, Directive, ElementRef, Input } from "angular2/core";
import {CanActivate} from "angular2/router";
import {FORM_DIRECTIVES} from 'angular2/common';
import {AuthProvider} from "../services/auth";
import {Store, Contact, Message, UserData} from "../services/store";
import {Transport} from "../services/transport";
import {MessagesView, MakeVisibleDirective} from "./messages";


@Directive({
  selector: "[setFocus]"
})
export class SetFocusDirective{
  constructor(private element: ElementRef){
  }
  
  @Input() set setFocus(val: boolean){
    if(val){
      setTimeout(() => this.element.nativeElement.focus(), 200);
    }
  }
}


@Component({
  selector: "home",
  directives: [FORM_DIRECTIVES, MessagesView, SetFocusDirective, MakeVisibleDirective],
  templateUrl: "app/components/home.html"
})
@CanActivate((next, previous) => {
  return AuthProvider.appInstance.checkIfAuthentificated();
})
export class HomeView implements OnDestroy {
  contacts: Contact[];
  messages: Message[] = new Array<Message>();
  editedContact: Contact = <Contact>{};
  newMessage: Message = <Message>{};
  userData: UserData;
  subscription: any;
  areMessagesLoading: boolean = false;
  errorString: string;
  
  constructor(private store: Store, private transport: Transport) {
    this.areMessagesLoading = true;
    store.getMessages().then((messages) => {
      this.messages = messages;
      this.areMessagesLoading = false;
      if(this.messages.length > 0){
        (<any>this.messages[this.messages.length - 1]).isNew = true; //make last message visible
      }
    }, this.showError.bind(this));
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
        store.saveContact(contact);
      }
      (<any>contact).selected = true;
    };
    
    this.showAttachment = (url) => {
      //add auth data
      url = url.replace("https://", `https://${this.transport.authData.apiToken}:${this.transport.authData.apiSecret}@`);
      url = url.replace("http://", `http://${this.transport.authData.apiToken}:${this.transport.authData.apiSecret}@`);
      window.open(url);
    };
    
    //handle incoming messages (and state of sent messages)
    this.subscription = transport.dataReceived.subscribe(ev => {
       if(ev.eventName == "message"){
         let message = <Message>ev.data;
         if(!((message.direction == "in" && message.to == this.userData.phoneNumber) || (message.direction == "out" && message.from == this.userData.phoneNumber))){
           return;
         }
         let existingMessage = this.messages.filter(m=>m.messageId == message.messageId)[0];
         if(existingMessage){
           existingMessage.state = message.state; //update state of exiting message
         }
         else{
           (<any>message).isNew = true; // to make it visible
           this.messages.push(message);
         }
       }
    });
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
  saveContact(){
    this.store.saveContact(this.editedContact);
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
  showAttachment: (url: string) => void;
  
  sendMessage(){
    this.newMessage.to = this.selectedContacts[0].phoneNumber  
    this.store.addMessage(this.newMessage).then(message=>{
      (<any>message).isNew = true; // to make it visible
      this.messages.push(message);
      this.newMessage = <Message>{};
    }, this.showError.bind(this));
  }
  
  private showError(err: any): void{
    this.errorString = err.message || err;
    setTimeout(()=>this.errorString = null, 5000); //hide in 5 seconds
  }
  
  canShowMessage(message: any): boolean{
    return message.isNew; //scroll to new created/received messages
  }
}