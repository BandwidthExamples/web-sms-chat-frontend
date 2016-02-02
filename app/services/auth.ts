import {Transport} from "./transport";

export class Authentificate{
  signIn(authData: AuthData): Promise<void> {
    return Transport.getInstance().signIn(authData);
  }
  
  signOut(): Promise<void> {
    return Transport.getInstance().signOut();
  }
}

export interface AuthData{
   userId: string;
   accessToken: string;
   accessSecret: string; 
}


