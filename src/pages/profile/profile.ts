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
//import {tryCatch} from "rxjs/util/tryCatch";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  peopleData: any = null;
  loading: any;
  photoBase64: any;
  photoRawData: any;
  token: string;
  idPerson:string;

  existList: boolean = false;

  groupList: any;

  constructor( public navCtrl: NavController,
               private userService: UserService,
               public loadingCtrl: LoadingController,
               private navParams: NavParams,
               private alertCtrl: AlertController,
               private camera: Camera,) {


    this.token = this.navParams.get('token');
    //Deploy console.log("Nuevo token profile: ",this.token);

    this.loadPeople();
  }


  async loadPeople() {

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos cargando la lista de asistencia, por favor espere...'
    });

    this.loading.present();

    this.peopleData = this.userService.getAttendance( this.token );

    await this.userService.getAttendance(this.token)
      .then((res)=>{
        this.peopleData = res;
      }).catch((err)=>{
        //Do nothing
      })

    try {
      console.log(JSON.stringify(this.peopleData));
      //Deploy console.log(this.peopleData[0].IdGroup);

      if (this.peopleData !== null){

        this.groupList = await this.userService.getGroupList(
          this.userService.getDateFormated(),
          this.peopleData[0].IdGroup,
          this.token
        );
        this.existList = true;
      }
    }catch (e) {
      this.errorAlert("No podemos conectarnos con el servidor, " +
        "por favor revise la conexión a internet");
    }


    //Deploy console.log( "New List: ", JSON.stringify( this.groupList ));

    this.loading.dismiss();

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
    };

    this.camera.getPicture(options).then((imageData) => {

      this.photoBase64 = 'data:image/png;base64,' + imageData;
      this.photoRawData = imageData;
      this.checkUser();

    }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
    });
  }

  async checkUser() {
    //Deploy console.log("Id persona: " + this.idPerson );
    await this.userService.checkUser( this.photoRawData,
                                      this.token,
                                      this.idPerson );

    this.navCtrl.pop();
    this.navCtrl.push( ProfilePage, { 'token':this.token } );
  }

  async unCheckUser( idPerson:string){

    await this.userService.unCheckUser( idPerson, this.token)
      .then( () => {
        //Do Nothing
      }).catch( () => {
        this.errorAlert(" Se ha presentado una falla en el registro de inasistencia!");
      });

    this.navCtrl.pop();
    this.navCtrl.push( ProfilePage, { 'token':this.token } );
  }

  async resetAttendance(){

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando la restauración de datos de asistencia, por favor espere...'
    });

    this.loading.present();

    for ( let i in this.groupList ) {
      await this.userService.resetAttendance( this.groupList[i].person.Id, this.token )
        .then( ()=>{
          //Do nothing!
        }).catch( ()=>{
          this.errorAlert("Ha habido un error en la restauración de datos " +
            "del beneficiario "+  this.groupList[i].person.Name );
        });
    }

    this.loading.dismiss();

    this.navCtrl.pop();
    this.navCtrl.push( ProfilePage, { 'token':this.token } );
  }

  goHome(){
    this.navCtrl.push( HomePage, { 'token':this.token } );
  }

  //TIME OUT PROMISE
  promiseTimeOut( ms, promise){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in '+ ms + 'ms.')
      }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ])
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

  errorAlert( error: any ) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['OK'],
      cssClass: 'alertCustomFatalErrors'
    });
    alert.present();
  }

}
