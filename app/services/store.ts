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

