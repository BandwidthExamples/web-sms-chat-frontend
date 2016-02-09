import {Transport} from "./transport";
import {Injectable} from "angular2/core";

@Injectable()
export class Store {
  
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
  
  addContact(contact): Contact{
    let contacts = this.loadContacts();
    contacts.push(contact);
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
    window.localStorage.setItem("contacts", JSON.stringify(contacts.map((c) => <Contact>{name: c.name, phoneNumber: c.phoneNumber})));
  }
  
  getUserData(): UserData{
    return <UserData>JSON.parse(window.localStorage.getItem("userData"));
  }
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  time: Date;
  direction: string;
  state: string;
}

export interface Contact {
  name: string;
  phoneNumber: string;
}

export interface UserData {
  phoneNumber: string;  
}

