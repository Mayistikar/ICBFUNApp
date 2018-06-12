import { Component } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController } from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';


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
  photoBase64: any;
  photoRawData: any;
  response: any;
  respUnCheck:any;
  token: string;
  idPerson:string;
  personView: boolean[] = [];

  constructor( public navCtrl: NavController,
               private userService: UserService,
               public loadingCtrl: LoadingController,
               private navParams: NavParams,
               private alertCtrl: AlertController,
               private camera: Camera,) {


    this.token = this.navParams.get('token');
    console.log("Nuevo token profile: ",this.token);

    this.loadPeople();
  }


  async loadPeople() {

    var personId: string;

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos cargando la lista de asistencia, por favor espere...'
    });

    this.loading.present();

    console.log("Token antes attendance : ",this.token);
    this.peopleData = await this.userService.getAttendance( this.token );

    //console.log(JSON.stringify(this.peopleData));


    for ( var i in this.peopleData){
      personId = this.peopleData[i].IdPerson;
      //console.log( personId );
      console.log(JSON.stringify( await this.userService.getPersonInfo( personId, this.token )));
      //this.peopleInfo.push( await this.userService.getPersonInfo( personId, this.token ) );

      this.personView[personId] = true;

      //console.log(JSON.stringify(this.peopleInfo[i].person));
    }

    this.loading.dismiss();

    //console.log(JSON.stringify(this.peopleInfo));

  }

  takePhotoAttendance( idPerson:string ){
    this.idPerson = idPerson;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 500,
      targetHeight: 500
    }

    this.camera.getPicture(options).then((imageData) => {

      this.photoBase64 = 'data:image/png;base64,' + imageData;
      this.photoRawData = imageData;
      this.checkUser();

    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  async checkUser() {
    console.log("Id persona: " + this.idPerson );
    this.response = await this.userService.checkUser( this.photoRawData, this.token, this.idPerson );
    //this.successAlert(this.response.Name+" Registro de asistencia exitoso!")
    this.successAlert("Registro de asistencia exitoso!");

    this.personView[this.idPerson] = false;
    //this.navCtrl.push( HomePage, { 'token':this.token } );
    //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  async unCheckUser( idPerson:string){
    this.respUnCheck = await this.userService.unCheckUser( idPerson, this.token);
    this.successAlert(" Registro de asistencia exitoso!");
    //this.navCtrl.push( HomePage, { 'token':this.token } );

    this.personView[idPerson] = false;
    //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  goHome(){
    this.navCtrl.push( HomePage, { 'token':this.token } );
  }



  //MOSTRANDO MENSAJES
  successAlert( success: any ) {
    let alert = this.alertCtrl.create({
      title: 'Completado!',
      subTitle: success,
      buttons: ['OK']
    });
    alert.present();
  }

}
