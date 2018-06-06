import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Http Imports
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { AttendancePage } from '../pages/attendance/attendance';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from "../pages/login/login";

//plugins
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';

//services
import { UserService } from '../providers/user-service/user-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    AttendancePage,
    ProfilePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    AttendancePage,
    ProfilePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
