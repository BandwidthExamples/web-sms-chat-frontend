// global: Notification

import {Injectable} from "angular2/core";

if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications");
}

@Injectable()
export class NotificationsProvider {
  showNotification(title: string, options: any = {}): any{
    let Notification = (<any>window).Notification;
    if(!Notification){
      return null;
    }
    if (Notification.permission === "granted") {
      return new Notification(title, options);
    }
    else if(Notification.permission !== "denied"){
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          return new Notification(title, options);
        }
      });
    }
  }
}