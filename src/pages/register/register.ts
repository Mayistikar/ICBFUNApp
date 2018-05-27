import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  photoBase64: string;
  data = {
    idDispositivo: 0,
    numerDocumentoBeneficiario: '',
    tipoDocumentoBeneficiario: '',
    fechaHoraEnrolamiento: '',
    caracteristicasRostro: ''
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera) {  }

  takePhotoRegister(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.photoBase64 = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));

    });
  }

}