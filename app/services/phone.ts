import {Injectable} from "angular2/core";
import {BWClient} from "bandwidth-webrtc";


@Injectable()
export class PhoneProvider {
  
  createPhone(): any {
    let userData = JSON.parse(window.localStorage.getItem("userData"));
    let phone = BWClient.createPhone({
        username: userData.userName,
        domain: userData.domain,
        authToken: userData.authToken,
        logLevel: "warn"//can be debug,log,warn,error (default=log)
    });
    return phone;
  }
}



