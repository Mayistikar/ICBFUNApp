import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController) {
  }



}
