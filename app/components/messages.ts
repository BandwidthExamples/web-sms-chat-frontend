import {Component,  ViewEncapsulation, Pipe, PipeTransform, Host, Input, Inject, forwardRef} from "angular2/core";
import {isFunction} from "angular2/src/facade/lang";
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
  templateUrl: "app/components/message.html"
})
export class MessageView {
  
  private messages:MessagesView;
  constructor(@Host() @Inject(forwardRef(() => MessagesView)) messages:MessagesView) {
    this.messages = messages;
  }
  
  getContactName(phoneNumber: string): string{
    if(isFunction(this.messages.getContactName)){
      let name =  this.messages.getContactName(phoneNumber);
      if(name){
        return name;
      }      
    }
    return phoneNumber;
  }
 }

@Component({
  selector: "messages",
  inputs: ["items"],
  templateUrl: "app/components/messages.html",
  directives: [MessageView],
  styleUrls: ["styles/messages.css"],
  encapsulation: ViewEncapsulation.None
})
export class MessagesView {
  @Input() getContactName: (phoneNumber: string) => string
}

