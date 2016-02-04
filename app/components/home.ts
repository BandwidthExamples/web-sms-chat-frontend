import {Component, Injector} from "angular2/core";
import {CanActivate} from "angular2/router";
import {AuthProvider} from "../services/auth";

@Component({
  selector: "home",
  template: "<p>TODO implement</p>"
})
@CanActivate((next, previous) => {
  return AuthProvider.appInstance.checkIfAuthentificated();
})
export class HomeView {
  constructor() {
  }
}