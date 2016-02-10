import {Component,  ViewEncapsulation, Pipe, PipeTransform, Host, Input, Inject, forwardRef} from "angular2/core";
import {isFunction} from "angular2/src/facade/lang";


@Pipe({
  name: "formatTime"
})
class FormatTimePipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return new Date(value).toLocaleString();
  }
}



@Component({
  selector: "message",
  inputs: ["item"],
  pipes: [FormatTimePipe],
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

