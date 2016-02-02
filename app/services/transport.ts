export class Transport{
  //TODO implement websocket communications here
  
  static instance:Transport;
  static isCreating:Boolean = false;
  
  
  constructor() {
    if (!Transport.isCreating) { //supress to create instance directly
        throw new Error("You can't call new in Transport instances!");
    }
  }
  
  // return singleton instance
  static getInstance() {
    if (Transport.instance == null) {
      Transport.isCreating = true;
      Transport.instance = new Transport();
      Transport.isCreating = false;
    }
    return Transport.instance;
  }
 
  
  signIn(authData): Promise<void> {
    return Promise.resolve(); //simulate success login
  }
  
  signOut(): Promise<void> {
    return Promise.resolve(); //simulate success logout
  }
  
  send(command: string, data: any): Promise<any>{
    return Promise.reject("TODO: implement it");
  }
  
  subscribe(eventName: string, handler: Function): void{
    
  }
  
  unsubscribe(eventName: string, handler: Function): void{
    
  }
}

