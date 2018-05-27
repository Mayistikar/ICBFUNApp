import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//services
import { UserService } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  photoBase64: string;
  data = {
    DeviceId: '100111',
    DocumentId: '',
    DocumentType: '',
    Name: ''
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private userService: UserService) {  }

  takePhotoRegister(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // If it's base64:
     this.photoBase64 = imageData;//'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  addNewUser(){
    console.log("Data: "+this.data.DocumentType);
    this.userService.getPeople();
    //this.userService.addPerson( this.data );
    this.userService.addPhoto( this.photoBase64, "3" );
  }

}
