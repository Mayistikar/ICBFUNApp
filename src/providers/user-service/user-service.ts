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



  constructor(public http: Http,
              public httpClient: HttpClient,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    console.log('Hello UserServiceProvider Provider');
  }

  checkUser( photoBase64: any){
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
          .set('Content-Type', 'application/octet-stream')
          .set('Filename', 'test2.png')
      })
        .subscribe(res => {
          resolve(res);
          this.loading.dismiss();
          //this.successAlert('Usuario agregado correctamente.');
          //this.person.push(JSON.stringify(res));
          this.successAlert( "Registro de asistencia exitoso!" );
        }, (err) => {
          reject(err);
          this.loading.dismiss();
          this.errorAlert("Ha habido un error en la toma de asistencia, " +
            "por favor inténtelo de nuevo. Error: ( "+JSON.stringify(err)+" )");
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
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
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

  addPhoto( photoBase64: any, idPerson: string, fileName: string ){
    let url = URL_SERVICE + "IMAGE/" + idPerson;

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando el registro...'
    });

    this.loading.present();

    let photoAdd = this.b64toBlob(photoBase64);

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, photoAdd, {
        headers: new HttpHeaders().set('Content-Type', 'application/octet-stream')
                                  .set('Filename', fileName+'.png')
      })
      .subscribe(res => {
        resolve(res);
        //this.successAlert('Usuario agregado correctamente.');
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
