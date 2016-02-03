import {Transport, AuthData} from "./transport";

export class AuthProvider {

  constructor(private transport: Transport) {
    transport.authData = JSON.parse(window.localStorage.getItem("authData"));
  }
  
  signIn(authData: AuthData): Promise<void> {
    return this.transport.send("signIn", authData).then(() => {
      this.transport.authData = authData;
      window.localStorage.setItem("authData", JSON.stringify(this.transport.authData));
    });
  }

  signOut(): Promise<void> {
    return this.transport.send("signOut").then(() => {
      this.transport.authData = null;
      window.localStorage.removeItem("authData");
    });
  }
  
  get isAuthentificated(): Boolean{
    return true; 
    //return !!this.transport.authData;
  }
  
}



