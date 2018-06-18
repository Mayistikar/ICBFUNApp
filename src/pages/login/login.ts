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
      //DEPLOY console.log('Your token is: ', val);
      //DEPLOY this.successAlert('Your token is: '+ val);
      this.token = val;

      //this.token = 'UHQFMIZO' // TO DEBUG
      //this.token = 'DRSIE3RO' // TO DEBUG

      this.loading.dismiss();
      if ( this.token != null ) {
        this.navCtrl.push( HomePage, { 'token':this.token } );
      }
    }).catch(()=>{
      this.successAlert("Lamentablemente, no hemos podido recuperar " +
        "el token de seguridad, sera necesario que utilice un nuevo código!");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async loginSuccess(){

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando la consulta del código, por favor espere...'
    });

    this.loading.present();

    //DEPLOY console.log( "My Code: "+this.hiddenCode );

    await this.userService.getToken(this.hiddenCode)
      .then((res)=>{
        this.response = res;
        this.loading.dismiss();
      }).catch((err)=>{
        this.response = err;
        this.loading.dismiss();
      });
        //console.log(this.response.Status);

    console.log(JSON.stringify(this.response));
        //console.log(this.userService.getToken(this.hiddenCode)[0]);
    console.log("Estado: ", this.response);

    if (this.response.Status === 'OK') {
      this.storage.set('token', this.response.SecurityToken);
      this.navCtrl.push(HomePage, {'token': this.token});
    } else if ( this.response.status === 0 ) {
      this.errorAlert("Es probable que no tenga acceso a internet, por favor revise su conexión!");
    } else if ( this.response.status === 403 ) {
      this.errorAlert("Es probable que el código ingresado, ya haya sido utilizado antes, por favor " +
        "contacte al administrador!");
    } else {
      this.errorAlert("Ha ingresado un código inválido, por favor intenténte nuevamente.");
    }


    //DEPLOY this.navCtrl.push( HomePage, { 'token':'UHQFMIZO' } );

  }

  exitApp(){
    this.platform.exitApp();
  }

  //MOSTRANDO MENSAJES
  errorAlert( error: any ) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['OK'],
      cssClass: 'alertCustomErrors' // <- added this
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
