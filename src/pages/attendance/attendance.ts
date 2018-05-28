import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//services
import { UserService } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {

  photoBase64: string;

  data = {
    DeviceId: '100111',
    DocumentId: '',
    DocumentType: '',
    Name: ''
  }

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private camera: Camera,
              private userService: UserService) {
  }

  takePhotoAttendance(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // If it's base64:
      this.photoBase64 = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  async checkUser() {
    let loading = this.loadingCtrl.create({
      content: 'Estamos realizando la consulta...'
    });

    loading.present();

    this.userService.checkUser( this.photoBase64, loading );
  }


}
