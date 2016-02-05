import {Transport} from "./transport";

export class Store {
  
  //demo data
  messages = new Array<Message>(
    { id: "1", from: "+1234567980", to: "+11111111111", text: "Test message 1", time: new Date("2016-02-01T09:29:50.120Z"), direction: "in", state: "received" },
    { id: "2", to: "+1234567980", from: "+11111111111", text: "Test message 2", time: new Date("2016-02-01T09:29:51.120Z"), direction: "out", state: "delivered" },
    { id: "3", from: "+1234567981", to: "+11111111111", text: "Test message 3", time: new Date("2016-02-01T09:29:52.120Z"), direction: "in", state: "received" },
    { id: "4", to: "+1234567982", from: "+11111111111", text: "Test message 4", time: new Date("2016-02-01T09:29:53.120Z"), direction: "out", state: "delivered" }
  );
  

  getMessages(): Promise<Message[]> {
    return Promise.resolve(this.messages); //simulate async operation
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
    return this.contacts = (JSON.parse(window.localStorage.getItem("contacts")) || new Array<Contact>());
  }
  
  private saveContacts(contacts: Contact[]): void{
    window.localStorage.setItem("contacts", JSON.stringify(contacts.map((c) => <Contact>{name: c.name, phoneNumber: c.phoneNumber})));
  }
  
  getPhoneNumber(): Promise<string>{
    return Promise.resolve("+1234567890");
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

