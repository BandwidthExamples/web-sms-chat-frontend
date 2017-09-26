import {Component, ViewEncapsulation, Pipe, PipeTransform, Host, Input, Inject, forwardRef, Directive, ElementRef} from "angular2/core";
import {Transport} from "../services/transport";
import {isFunction} from "angular2/src/facade/lang";

const images = [".png", ".jpg", ".webp", ".bmp", ".gif"];

function isImage(url: string): boolean {
  return images.filter(i => url.toLocaleLowerCase().indexOf(i) > 0).length > 0;
}

@Pipe({
  name: "formatTime"
})
class FormatTimePipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return new Date(value).toLocaleString();
  }
}

@Pipe({
  name: "nonImages"
})
class NonImagesPipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return value.filter(u => !isImage(u));
  }
}

@Pipe({
  name: "images"
})
class ImagesPipe implements PipeTransform {
  transform(value: any, args: any[]) {
    return value.filter(u => isImage(u));
  }
}

function b64EncodeUnicode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode(Number("0x" + p1));
  }));
}

@Pipe({
  name: "blob"
})
class BlobPipe implements PipeTransform {
  constructor(private transport: Transport) {

  }
  transform(value: any, args: any[]) {
    const headers = new Headers();
    const authData = this.transport.authData;
    headers.append("Authorization", "Basic " + b64EncodeUnicode(authData.apiToken + ":" + authData.apiSecret));
    return window.fetch(value, {headers, method: "GET"}).then(r => r.blob()).then(blob => window.URL.createObjectURL(blob));
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
  pipes: [FormatTimePipe, NonImagesPipe, ImagesPipe, BlobPipe],
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

