import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//pages
import { RegisterPage } from '../register/register';
import { AttendancePage } from '../attendance/attendance';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  registerPage:any = RegisterPage;
  attendancePage:any = AttendancePage;
  
  constructor(public navCtrl: NavController) {  }

}
