import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  response: any[] = [];

  constructor(public navCtrl: NavController,
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
     this.photoBase64 = 'data:image/png;base64,' + imageData;
    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  async addNewUser(){
    console.log("Data: "+this.data.DocumentType);
    //this.userService.getPeople();
    this.response.push( await this.userService.addPerson( this.data ) );
    console.log("Data Json: ", this.response[0].Id);
    this.userService.addPhoto( this.photoBase64,
                                this.response[0].Id,
                                this.response[0].Name );

  }

}
