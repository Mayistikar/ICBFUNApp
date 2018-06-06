import { Component } from '@angular/core';
import { AlertController, NavController, Platform, LoadingController } from 'ionic-angular';

//Pages
import { HomePage } from "../home/home";

//services
import { UserService } from '../../providers/user-service/user-service';

//Storage
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  hiddenCode:string;
  response:any;
  token:string;
  loading:any;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              private userService: UserService,
              private storage: Storage,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando el token de acceso, por favor espere...'
    });

    this.loading.present();
    this.storage.get('token').then((val) => {
      console.log('Your token is: ', val);
      //DEPLOY this.successAlert('Your token is: '+ val);
      this.token = val;
      this.loading.dismiss();
      if ( this.token != null ) {
        this.navCtrl.push( HomePage, { 'token':this.token } );
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async loginSuccess(){
    console.log( "My Code: "+this.hiddenCode );

    this.response = await this.userService.getToken(this.hiddenCode);
    this.response.SecurityToken;
    console.log(this.response.Status);

    //console.log(JSON.stringify(this.response));
    //console.log(this.userService.getToken(this.hiddenCode)[0]);


    if ( this.response.Status === "OK" ) {
      this.storage.set('token', this.response.SecurityToken);
      this.navCtrl.push( HomePage, { 'token':this.token } );
    }else{
      this.errorAlert("Ha ingresado un código inválido!");
    }

  }

  exitApp(){
    this.platform.exitApp();
  }

  //MOSTRANDO MENSAJES
  errorAlert( error: any ) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['OK']
    });
    alert.present();
  }

  successAlert( success: any ) {
    let alert = this.alertCtrl.create({
      title: 'Completado!',
      subTitle: success,
      buttons: ['OK']
    });
    alert.present();
  }


}
