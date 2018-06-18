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
  todayDate:any;



  constructor(public http: Http,
              public httpClient: HttpClient,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    console.log('Hello UserServiceProvider Provider');
  }

  setHiddenCode( hCode:string ){
    this.hideenCode = hCode;
  }

  getToken( code:string = "00000000000"){

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

  resetAttendance( idPerson:string, token:string ){

    console.log("RESET ATT EXECUTED!!!!!!");
    let url = URL_SERVICE + "CHECK";
    let bodyUnCheck = {
      'IdPerson':idPerson,
      'AttendantStatus':null
    };

    return new Promise((resolve, reject) => {

      this.httpClient.post(url, bodyUnCheck, {
        headers: new HttpHeaders()
          .set('SecurityToken', token)
          .set('Content-Type', 'application/json')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  unCheckUser( idPerson:string, token:string ){
    let url = URL_SERVICE + "CHECK";
    let bodyUnCheck = {
      'IdPerson':idPerson,
      'AttendantStatus':'UNCHECKED'
    };

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

  checkUser( photoBase64: any, token:string, idPerson:string ){
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
          .set('IdPerson', idPerson.toString())
          .set('Content-Type', 'application/octet-stream')
          .set('Filename', 'test2.png')
      })
        .subscribe(res => {
          resolve(res);
          this.loading.dismiss();

        }, (err) => {
          reject(err);
          this.loading.dismiss();
          //this.errorAlert("Ha habido un error en la toma de asistencia, " +
          //  "por favor inténtelo de nuevo. Error: ( "+JSON.stringify(err)+" )");
          this.errorStatus(err);
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

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos registrando los datos del beneficiario...'
    });

    this.loading.present();

    return new Promise((resolve, reject) => {

      this.httpClient.post(url, JSON.stringify(data), {
        headers: new HttpHeaders()
          .set('SecurityToken', data.DeviceId.toString())
          .set('Content-Type', 'application/json')
      })
      .subscribe(res => {
        this.loading.dismiss();
        resolve(res);
      }, (err) => {
        this.loading.dismiss();
        reject(err);
        //console.log(JSON.stringify(err));
        this.errorStatus(err);
      });
    });
  }

  addPhoto( photoBase64: any, idPerson: string, fileName: string, idDevice: string ){

    console.log("Agregando fotografía");
    let url = URL_SERVICE + "IMAGE/" + idPerson;

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Estamos realizando el registro de la fotografía...'
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
        this.loading.dismiss();
        resolve(res);
      }, (err) => {
        this.loading.dismiss();
        reject(err);
        //DEPLOY this.errorAlert("Ha habido un problema agregando la foto de la persona: ( +JSON.stringify(err)+" )");
      });

    });

  }

  //PROCESANDO IMAGEN
  b64toBlob(b64Data) {
    let contentType = '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
    //return blob;
  }

  getAttendance( token:string ) {
    let url = URL_SERVICE + "ATTENDANT";

      return new Promise((resolve, reject) => {

        this.httpClient.get(url, {
          headers: new HttpHeaders()
          .set('SecurityToken', token)
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
            this.errorStatus(err);
          });

      });
  }


  getPersonInfo( personId:string, token:string  ) {
    let url = URL_SERVICE + "CHECK/" + personId;

    return new Promise((resolve, reject) => {

      this.httpClient.get(url, {
        headers: new HttpHeaders()
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

  getGroupList( dateToday:string, group:string, token:string  ) {
    let url = URL_SERVICE+"GROUP/"+group+"/SESSION/"+dateToday;

    return new Promise((resolve, reject) => {

      this.httpClient.get(url, {
        headers: new HttpHeaders()
          .set('SecurityToken', token)
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          this.errorAlert("Ha habido un problema obteniendo el grupo de asistencia: "
            + JSON.stringify(err) + " )");
        });

    });
  }

  //ADMINISTRANDO ERRORES
  errorStatus( error: any){

    if( error.error.internal_status === "UNKNOWN_GROUP"){
      error.status = 801
    }

    switch( error.status ) {
      case 0:{
        this.errorAlert("No hemos podido conectarnos a internet, " +
          "por favor revise su conexión!");
        break;
      }
      case 400: {
        if( error.error.internal_status === "INTEGRITY_ERROR"){
          this.errorAlert("El número de documento del beneficiario ya se encuentra registrado!" );
        } else {
          this.errorAlert("No hemos detectado rostros en la imagen, " +
            "por favor vuelva a intentarlo.");
        }
        break;
      }
      case 403: {
        this.errorAlert("El beneficiario de la lista no coincide " +
          "con la fotografía, por favor vuelva a intentarlo");
        break;
      }
      case 409: {
        this.errorAlert("Ha sobrepasado la capacidad de registros para este código");
        break;
      }
      case 500:{
        console.log(error);
        this.errorAlert("El documento ingresado, ya se encuentra registrado!");
        break;
      }
      case 801:{
        this.errorAlert("El código actual no tiene registrado un grupo correspondiente!");
        break;
      }
      default: {
        this.errorAlert("Se ha presentado un problema, dificil de determinar...");
        break;
      }
    }

  }

  //CALCULANDO FECHAS
  getDateFormated(){
    this.todayDate = new Date();
    let mm = this.todayDate.getMonth()+1;
    let dd = this.todayDate.getDate();
    let yyyy = this.todayDate.getFullYear();

    if( dd < 10){
      dd = '0'+dd;
    }

    if( mm < 10){
      mm = '0'+mm;
    }

    return yyyy+"-"+mm+"-"+dd;
  }

  //MOSTRANDO MENSAJES

  errorAlert( error: any ) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['OK'],
      cssClass: 'alertCustomFatalErrors'
    });
    alert.present();
  }

  successAlert( success: any ) {
    let alert = this.alertCtrl.create({
      title: 'Completado!',
      subTitle: success,
      buttons: ['OK'],
      cssClass: 'alertCustomErrors'
    });
    alert.present();
  }

}
