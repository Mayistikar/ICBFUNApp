import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//pages
import { HomePage } from '../home/home';

//services
import { UserService } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  peopleData: any;

  constructor( public navCtrl: NavController,
               private userService: UserService) {
    this.loadPeople();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  async loadPeople() {
    this.peopleData = await this.userService.getPeople() ;
  }

  goHome(){
    this.navCtrl.push( HomePage );
  }

}
