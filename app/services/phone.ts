import {BWClient, BWPhone} from "bandwidth-webrtc";
import {Injectable} from "angular2/core";

@Injectable()
export class PhoneProvider {
  
  createPhone(): BWPhone {
    let userData = JSON.parse(window.localStorage.getItem("userData"));
    let phone = window.BWClient.createPhone({
        username: userData.userName,
        domain: `${userData.domain}.bwapp.bwsip.io`,
        password: userData.password,
        logLevel: "log"//can be debug,log,warn,error (default=log)
    });
    return phone;
  }
}



