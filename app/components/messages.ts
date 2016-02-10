import {Component, ViewEncapsulation, Pipe, PipeTransform, Host, Input, Inject, forwardRef, Directive, ElementRef} from "angular2/core";
import {isFunction} from "angular2/src/facade/lang";


@Pipe({
  name: "formatTime"
})
class FormatTimePipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return new Date(value).toLocaleString();
  }
}

@Directive({
  selector: "[makeVisible]"
})
export class MakeVisibleDirective{
  constructor(private element: ElementRef){
  }
  
  @Input() set makeVisible(val: boolean){
    if(val){
      setTimeout(() => this.element.nativeElement.scrollIntoView(), 200);
    }
  }
}



@Component({
  selector: "message",
  inputs: ["item"],
  pipes: [FormatTimePipe],
  templateUrl: "app/components/message.html"
})
export class MessageView {

  private messages: MessagesView;
  constructor( @Host() @Inject(forwardRef(() => MessagesView)) messages: MessagesView) {
    this.messages = messages;
  }

  getContactName(phoneNumber: string): string {
    if (isFunction(this.messages.getContactName)) {
      let name = this.messages.getContactName(phoneNumber);
      if (name) {
        return name;
      }
    }
    return phoneNumber;
  }

  selectContact(phoneNumber: string): boolean {
    if (isFunction(this.messages.selectContact)) {
      this.messages.selectContact(phoneNumber);
    }
    return false;
  }
  
  getAttachment(url: string): void{
    if (isFunction(this.messages.getAttachment)) {
      this.messages.getAttachment(url);
    }
  }
}

@Component({
  selector: "messages",
  inputs: ["items"],
  templateUrl: "app/components/messages.html",
  directives: [MessageView, MakeVisibleDirective], 
  styleUrls: ["styles/messages.css"],
  encapsulation: ViewEncapsulation.None
})
export class MessagesView {
  @Input() getContactName: (phoneNumber: string) => string
  @Input() selectContact: (phoneNumber: string) => void
  @Input() canMakeVisible: (item: any) => boolean
  @Input() getAttachment: (url: string) => void
  
  checkCanMakeVisible(item: any): boolean{
    if (isFunction(this.canMakeVisible)) {
      return this.canMakeVisible(item);
    }
    return false;
  }
}

