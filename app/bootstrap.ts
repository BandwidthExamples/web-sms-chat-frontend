import {bootstrap}    from "angular2/platform/browser"
import {SmsApp} from "./app"
import {MessageStore} from "./services/store";

bootstrap(SmsApp, [MessageStore]);
