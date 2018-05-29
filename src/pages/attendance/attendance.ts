import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//services
import { UserService } from '../../providers/user-service/user-service';

//pages
import {HomePage} from "../home/home";



@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {

  photoBase64: any;
  photoRawData: any;

  data = {
    DeviceId: '100111',
    DocumentId: '',
    DocumentType: '',
    Name: ''
  }

  response: any;

  constructor(public navCtrl: NavController,
              private camera: Camera,
              private userService: UserService) {
  }

  takePhotoAttendance(){
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

    this.response = await this.userService.checkUser( this.photoRawData );
    this.navCtrl.push( HomePage );
  }

  goHome(){
    this.navCtrl.push( HomePage );
  }


}
