import {Transport, AuthData} from "./transport";
import {Router} from "angular2/router";
import {Injectable} from "angular2/core";

@Injectable()
export class AuthProvider {
  constructor(private transport: Transport, private router: Router) {
    transport.authData = JSON.parse(window.localStorage.getItem("authData"));
  }

  signIn(authData: AuthData): Promise<void> {
    return this.transport.execute("signIn", authData).then((data) => {
      this.transport.authData = authData;
      window.localStorage.setItem("authData", JSON.stringify(this.transport.authData));
      window.localStorage.setItem("userData", JSON.stringify(data));
      return data;
    });
  }

  checkIfAuthentificated(): Promise<boolean> {
    if (this.transport.authData) {
      return Promise.resolve(true);
    }
    this.router.navigate(["SignIn"]);
    return Promise.resolve(false);
  }

  static appInstance: AuthProvider; // global instance (to use it in attributes)

}



