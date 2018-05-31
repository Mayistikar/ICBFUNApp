import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

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
  peopleInfo: any[] = [];
  loading: any;

  constructor( public navCtrl: NavController,
               private userService: UserService,
               public loadingCtrl: LoadingController) {
    this.loadPeople();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  async loadPeople() {

    var personId: string;

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos cargando la lista de asistencia, por favor espere...'
    });

    this.loading.present();


    //this.peopleData = await this.userService.getPeople() ;
    this.peopleData = await this.userService.getAttendance();

    for ( var i in this.peopleData){
      personId = this.peopleData[i].IdPerson;
      //console.log(JSON.stringify( await this.userService.getPersonInfo( personId )));
      this.peopleInfo.push( await this.userService.getPersonInfo( personId ) );
    }

    this.loading.dismiss();

    console.log(JSON.stringify(this.peopleInfo[0].person));

  }

  goHome(){
    this.navCtrl.push( HomePage );
  }

}
