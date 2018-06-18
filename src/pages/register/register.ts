import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//services
import { UserService } from '../../providers/user-service/user-service';

//pages
import { HomePage } from '../home/home';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  photoBase64: string = 'No hay foto';
  photoRawData: any;
  currentDate: any;

  data = {
    DeviceId: '',
    DocumentId: '',
    DocumentType: '',
    Name: '',
    SurName: '',
  }

  response: any = null;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              private navParams: NavParams,
              private camera: Camera,
              private userService: UserService) {
    this.currentDate = new Date();

    this.data.DeviceId = this.navParams.get('token');
    //DEPLOY console.log('Token is', this.data.DeviceId);
  }

  takePhotoRegister(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 500,
      targetHeight: 500
    };

    this.camera.getPicture(options).then((imageData) => {
     // If it's base64:
     this.photoBase64 = 'data:image/png;base64,' + imageData;
     this.photoRawData = imageData;
    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  async addNewUser(){

    if ( this.validateForm() ) {

      await this.userService.addPerson(this.data)
        .then((res)=>{
          this.response = res;
        }).catch((err)=>{
          //Do nothing
        });


      if ( this.response !== null ){

        await this.userService.addPhoto(  this.photoRawData,
                                          this.response.Id,
                                          this.response.Name,
                                          this.data.DeviceId )
          .then((res)=>{
            this.successAlert("Beneficiario registrado correctamente!" );
          }).catch((err)=>{
            //Do nothing
          });

        this.navCtrl.push( HomePage, { 'token':this.data.DeviceId } );

      }

    }

  }

  goHome(){
    this.navCtrl.push( HomePage, { 'token':this.data.DeviceId } );
  }


  //MESSAGES
  successAlert( success: string ) {
    let successAlert = this.alertCtrl.create({
      title: 'Completado!',
      subTitle: success,
      buttons: ['OK'],
      cssClass: 'alertCustomErrors'
    });
    successAlert.present();
  }

  errorAlert( error: string ) {
    let errorAlert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['OK'],
      cssClass: 'alertCustomErrors' // <- added this
    });
    errorAlert.present();
  }

  //VALIDATIONS
  validateForm(){
    for ( var formElement in this.data ){
      console.log(this.data[formElement]);
      if (this.data[formElement] == ''){
        this.errorAlert( "Por favor ingrese todos los campos solicitados!" );
        return false;
      }
    }
    if( this.photoBase64 === 'No hay foto' ){
      this.errorAlert( "Para el registro debe tomarse una fotografía!" );
      return false;
    }
    return true;
  }


}
