import {Component,  ViewEncapsulation, Pipe, PipeTransform} from "angular2/core";
import * as moment_ from "moment";

// under systemjs, moment is actually exported as the default export, so we account for that
const moment = (<any>moment_)["default"] || moment_;


@Pipe({
  name: "fromNow"
})
class FromNowPipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return moment(value).fromNow();
  }
}


@Component({
  selector: "message",
  inputs: ["item"],
  pipes: [FromNowPipe],
  templateUrl: "app/directives/message.html"
})
export class MessageView { }

@Component({
  selector: "messages",
  inputs: ["items"],
  templateUrl: "app/directives/messages.html",
  directives: [MessageView],
  styleUrls: ["styles/messages.css"],
  encapsulation: ViewEncapsulation.Native
})
export class MessagesView {
}

