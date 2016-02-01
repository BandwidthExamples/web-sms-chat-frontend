export class MessageStore{
  
  //demo data
  messages = new Array<Message>(
    {id: "1", from: "+1234567980", to: "+11111111111", text: "Test message 1", time: new Date("2016-02-01T09:29:50.120Z"), direction: "in", state: "received"},
    {id: "2", to: "+1234567980", from: "+11111111111", text: "Test message 2", time: new Date("2016-02-01T09:29:51.120Z"), direction: "out", state: "delivered"},
    {id: "3", from: "+1234567981", to: "+11111111111", text: "Test message 3", time: new Date("2016-02-01T09:29:52.120Z"), direction: "in", state: "received"},
    {id: "4", to: "+1234567982", from: "+11111111111", text: "Test message 4", time: new Date("2016-02-01T09:29:53.120Z"), direction: "out", state: "delivered"}
  );
  
  getMessages(): Promise<Message[]>{
    return new Promise((resolve, reject) => resolve(this.messages)); //simulate async operation
  }
}

export interface Message{
  id: string;
  from: string;
  to: string;
  text: string;
  time: Date;
  direction: string;
  state: string;
}
