import {Component, View} from "angular2/core";

@Component({
  selector: "message",
  inputs: ["item"],
  templateUrl: "app/directives/message.html"
})
export class MessageView {}

@Component({
  selector: "messages",
  inputs: ["items"],
  templateUrl: "app/directives/messages.html",
  directives: [MessageView]
})
export class MessagesView {
}

