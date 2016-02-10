import {Component, ViewEncapsulation, EventEmitter, Output} from "angular2/core";
import {FORM_DIRECTIVES} from 'angular2/common';
import {AuthProvider} from '../services/auth';
import {Router} from "angular2/router";

@Component({
  selector: "signInForm",
  templateUrl: "app/components/signIn.html",
  directives: [FORM_DIRECTIVES]
})
export class SignInView {
  constructor(private authProvider: AuthProvider, private router: Router) {
  }
     
  errorString: string;
  isProcessing: boolean = false;
  signIn(data){
    this.isProcessing = true;
    return this.authProvider.signIn(data)
    .then(()=>{
      this.router.navigate(["Home"]);
    }, (err)=>{
      this.isProcessing = false;
      this.errorString = err.message || err;
    });
  }
 }