import { Injectable } from '@angular/core';

//Http imports
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

//services
import { URL_SERVICE } from '../../config/url.services';

//components
import { AlertController, LoadingController } from 'ionic-angular';



@Injectable()
export class UserService {

  person:any[] = [];
  loading:any;
  hideenCode:string;



  constructor(public http: Http,
              public httpClient: HttpClient,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    console.log('Hello UserServiceProvider Provider');
  }

  setHiddenCode( hCode:string ){
    this.hideenCode = hCode;
  }

  getToken( code:string ){
    let url = URL_SERVICE + "CODE/" + code +"/EXCHANGE";

    return new Promise((resolve, reject) => {

      this.httpClient.post(url,"",{})
        .subscribe(res => {
          //console.log("Respuesta: "+ JSON.stringify(res));
          resolve( res );
        }, (err) => {
          reject( err );
         //this.errorAlert("El token suministrado es invalido!")
        });

    });
  }

  unCheckUser( idPerson:string, token:string ){
    let url = URL_SERVICE + "CHECK";
    let bodyUnCheck = {
      'IdPerson':idPerson,
      'AttendanceStatus':'UNCHECKED'
    }

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando el registro de asistencia, por favor espere...'
    });

    this.loading.present();

    return new Promise((resolve, reject) => {

      this.httpClient.post(url, bodyUnCheck, {
        headers: new HttpHeaders()
          .set('SecurityToken', token)
          .set('Content-Type', 'application/json')
      })
        .subscribe(res => {
          resolve(res);
          this.loading.dismiss();
          //this.successAlert('Usuario agregado correctamente.');
          //this.person.push(JSON.stringify(res));
          //this.successAlert( " Registro de asistencia exitoso!" );
        }, (err) => {
          reject(err);
          this.loading.dismiss();
          //this.errorAlert("Ha habido un error en la toma de asistencia, " +
          //  "por favor inténtelo de nuevo. Error: ( "+JSON.stringify(err)+" )");
          this.errorAlert("Ha habido un error en la toma de inasistencia, " +
            "por favor inténtelo nuevamente.");
        });
    });
  }

  checkUser( photoBase64: any, token:string ){
    let url = URL_SERVICE + "CHECK";

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando el registro de asistencia, por favor espere...'
    });

    this.loading.present();

    let photoCheck = this.b64toBlob(photoBase64);

    return new Promise((resolve, reject) => {

      this.httpClient.post(url, photoCheck, {
        headers: new HttpHeaders()
          .set('SecurityToken', token)
          .set('Content-Type', 'application/octet-stream')
          .set('Filename', 'test2.png')
      })
        .subscribe(res => {
          resolve(res);
          this.loading.dismiss();
          //this.successAlert('Usuario agregado correctamente.');
          //this.person.push(JSON.stringify(res));
          //this.successAlert( " Registro de asistencia exitoso!" );
        }, (err) => {
          reject(err);
          this.loading.dismiss();
          //this.errorAlert("Ha habido un error en la toma de asistencia, " +
          //  "por favor inténtelo de nuevo. Error: ( "+JSON.stringify(err)+" )");
          this.errorAlert("Ha habido un error en la toma de asistencia, " +
            "por favor revise que la fotografía haya capturado su rostro.");
        });
    });


  }

  getPeople() {
    let url = URL_SERVICE + "PERSON";

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos cargando la lista de asistencia, por favor espere...'
    });

    this.loading.present();

    return new Promise(resolve => {
      this.httpClient.get( url )
               .subscribe(data => {
        resolve(data);
        this.loading.dismiss();
      }, err => {
        this.errorAlert("Ha habido un problema cargando la lista: ( "
                        +JSON.stringify(err)+" )");
        this.loading.dismiss();
      });
    });

  }

  addPerson( data: any ){
    let url = URL_SERVICE + "PERSON";

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, JSON.stringify(data), {
        headers: new HttpHeaders()
          .set('SecurityToken', data.DeviceId.toString())
          .set('Content-Type', 'application/json')
      })
      .subscribe(res => {
        console.log("Inside add FUnc: ",res);
        resolve(res);
      }, (err) => {
        console.log("Inside add FUnc: ",err);
        reject(err);
        this.errorAlert("Ha habido un problema registrando los datos de la persona: ( "+JSON.stringify(err)+" )");
      });
    });
  }

  addPhoto( photoBase64: any, idPerson: string, fileName: string, idDevice: string ){
    let url = URL_SERVICE + "IMAGE/" + idPerson;

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando el registro...'
    });

    this.loading.present();

    let photoAdd = this.b64toBlob(photoBase64);


    return new Promise((resolve, reject) => {
      this.httpClient.post(url, photoAdd, {
        headers: new HttpHeaders()
          .set('SecurityToken', idDevice)
          .set('Content-Type', 'application/octet-stream')
          .set('Filename', fileName+'.png')
      })
      .subscribe(res => {
        resolve(res);
        this.successAlert('Fotografía agregada correctamente.');
        this.loading.dismiss();
      }, (err) => {
        reject(err);
        this.errorAlert("Ha habido un problema agregando la foto de la persona: ( "
          +JSON.stringify(err)+" )");
        this.loading.dismiss();
      });

    });

  }


  //PROCESANDO IMAGEN
  b64toBlob(b64Data) {
    var contentType = '';
    var sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  getAttendance( token:string ) {
    let url = URL_SERVICE + "ATTENDANT";

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos cargando la lista de asistencia, por favor espere...'
    });

    this.loading.present();
    //DEPLOY this.successAlert("El token dentro attendance: "+token);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url, {
          headers: new HttpHeaders()
          //DEPLOY .set('SecurityToken', 'UHQFMIZO')
          .set('SecurityToken', token)
        })
          .subscribe(res => {
            resolve(res);
            this.loading.dismiss();
          }, (err) => {
            reject(err);
            this.errorAlert("Ha habido un problema obteniendo la información de los grupos: ( "
              + JSON.stringify(err) + " )");
            this.loading.dismiss();
          });

      });

  }


  getPersonInfo( personId:string, token:string  ) {
    let url = URL_SERVICE + "CHECK/" + personId;

    return new Promise((resolve, reject) => {

      this.httpClient.get(url, {
        headers: new HttpHeaders()
        //DEPLOY .set('SecurityToken', 'UHQFMIZO')
        .set('SecurityToken', token)
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          this.errorAlert("Ha habido un problema obteniendo la información del usuario: ( "
            + JSON.stringify(err) + " )");
        });

    });

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
