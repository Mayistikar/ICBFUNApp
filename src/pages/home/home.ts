import { Component } from '@angular/core';

//pages
import { RegisterPage } from '../register/register';
import { ProfilePage } from "../profile/profile";

//components
import { Platform, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  registerPage:any = RegisterPage;
  profilePage: any = ProfilePage;
  token: string;

  constructor( public platform: Platform,
               private navParams: NavParams ) {
    this.platform = platform;
    this.token = this.navParams.get('token');
  }

  exitApp(){
    this.platform.exitApp();
  }

}
