import { Component } from '@angular/core';

//pages
import { RegisterPage } from '../register/register';
import { AttendancePage } from '../attendance/attendance';
import { ProfilePage } from "../profile/profile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  registerPage:any = RegisterPage;
  attendancePage:any = AttendancePage;
  profilePage: any = ProfilePage;

  constructor() {  }

}
