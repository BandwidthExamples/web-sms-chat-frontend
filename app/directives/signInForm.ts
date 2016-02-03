import {Component, ViewEncapsulation} from "angular2/core";
import { FORM_DIRECTIVES } from 'angular2/common';
import {AuthProvider} from '../services/auth';

@Component({
  selector: "signInForm",
  templateUrl: "app/directives/signInForm.html",
  directives: [FORM_DIRECTIVES],
  encapsulation: ViewEncapsulation.Native
})
export class SignInFormView {
  constructor(private authProvider: AuthProvider) {
  }
  
  error: string;
  
  signIn(data){
    return this.authProvider.signIn(data)
    .catch((err)=>{
      this.error = err.message || err;
    });
  }
 }