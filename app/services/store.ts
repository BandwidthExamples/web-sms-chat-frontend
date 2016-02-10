import {Transport} from "./transport";
import {Injectable} from "angular2/core";

@Injectable()
export class Store {
  
  private contactIdGenerator: number;
  
  constructor(private transport: Transport){
  }
  

  getMessages(): Promise<Message[]> {
    return this.transport.execute("getMessages", {phoneNumber: this.getUserData().phoneNumber});
  }
  
  addMessage(message: Message): Promise<Message> {
    message.from = this.getUserData().phoneNumber;
    return this.transport.execute("sendMessage", message);
  }
  
  private contacts: Contact[];
  
  getContacts(): Contact[] {
    return this.loadContacts();
  }
  
  saveContact(contact): Contact{
    let contacts = this.loadContacts();
    if(contact.id){
      // existing contact
      let existingContact = contacts.filter(c=>c.id == contact.id)[0];
      if(existingContact){
        existingContact.phoneNumber = contact.phoneNumber;
        existingContact.name = contact.name;
        contact = existingContact;
      }  
    }
    else{
      // new contact
      contact.id = Math.random().toString(36).substring(5);
      contacts.push(contact);
    }
    this.saveContacts(contacts);
    return contact;
  }
  
  removeContact(index): void{
    let contacts = this.loadContacts();
    contacts.splice(index, 1);
    this.saveContacts(contacts);
  }
  
  private loadContacts(): Contact[]{
    if(this.contacts){
      return this.contacts;
    }
    this.contacts = (JSON.parse(window.localStorage.getItem("contacts")) || new Array<Contact>());
    this.contacts.sort((a: Contact, b: Contact) => {
      if(a.name < b.name) return -1;
      if(a.name == b.name) return 0;
      return 1;
    });
    return this.contacts;
  }
  
  private saveContacts(contacts: Contact[]): void{
    window.localStorage.setItem("contacts", JSON.stringify(contacts.map((c) => <Contact>{id: c.id, name: c.name, phoneNumber: c.phoneNumber})));
  }
  
  getUserData(): UserData{
    return <UserData>JSON.parse(window.localStorage.getItem("userData"));
  }
}

export interface Message {
  messageId: string;
  from: string;
  to: string;
  text: string;
  time: Date;
  direction: string;
  state: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface UserData {
  phoneNumber: string;  
}

