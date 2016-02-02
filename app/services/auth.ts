import {Transport, AuthData} from "./transport";

export class Authentificate {
  signIn(authData: AuthData): Promise<void> {
    return Transport.getInstance().signIn(authData);
  }

  signOut(): Promise<void> {
    return Transport.getInstance().signOut();
  }
}



