import { Injectable } from '@angular/core';

//Http imports
//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

//services
import { URL_SERVICE } from '../../config/url.services';

//components
import { AlertController } from 'ionic-angular';



@Injectable()
export class UserService {

  people:any[] = [];
  person:any[] = [];

  constructor(public http: Http,
              public httpClient: HttpClient,
              public alertCtrl: AlertController) {
    console.log('Hello UserServiceProvider Provider');
  }

  getPeople() {
    let url = URL_SERVICE + "PERSON";

    return new Promise(resolve => {
      this.http.get( url )
               .map( resp => resp.json() )
               .subscribe(data => {
        resolve(data);
        console.log(data);
        this.people.push(data);
        console.log("Local data ", this.people);
      }, err => {
        console.log(err);
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
        reject(err);
        this.errorAlert(err);
      });
    });
  }

  addPhoto( photoBase64: string, idPerson: string, fileName: string ){
    let url = URL_SERVICE + "IMAGE/" + idPerson;

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, photoBase64, {
        headers: new HttpHeaders().set('Content-Type', 'application/octet-stream')
                                  .set('Filename', fileName+'.png')
      })
      .subscribe(res => {
        resolve(res);
        this.successAlert('Usuario agregado correctamente.');
      }, (err) => {
        reject(err);
        this.errorAlert(err);
      });
    });

  }

  errorAlert( error: any ) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: JSON.stringify(error),
      buttons: ['OK']
    });
    alert.present();
  }

  successAlert( success: string ) {
    let alert = this.alertCtrl.create({
      title: 'Completado!',
      subTitle: success,
      buttons: ['OK']
    });
    alert.present();
  }

}
