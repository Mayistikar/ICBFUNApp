import { Injectable } from '@angular/core';

//Http imports
//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

//services
import { URL_SERVICE } from '../../config/url.services';



@Injectable()
export class UserService {

  people:any[] = [];

  constructor(public http: Http,
              public httpClient: HttpClient) {
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
        //console.log("Local data ", this.people);
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
        resolve(res);
        console.log(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  addPhoto( photoBase64: string, idPerson: string ){
    let url = URL_SERVICE + "PERSON/" + idPerson;

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, photoBase64, {
        headers: new HttpHeaders().set('Content-Type', 'application/octet-stream')
                                  .set('Filename', 'Anderson_R.png')
        //params: new HttpParams().set('id', '3'),
      })
      .subscribe(res => {
        resolve(res);
        console.log(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  // getPeople(){
  //
  //   let url = URL_SERVICE + "PERSON";
  //
  //   this.http.get( url )
  //            .map( resp => resp.json() )
  //            .subscribe( data => {
  //              console.log(data);
  //            })
  //
  // }

}
