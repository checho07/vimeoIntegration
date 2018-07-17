import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RestProvider } from '../providers/rest/rest';
import { Camera } from '@ionic-native/camera';
import { MediaCapture  } from '@ionic-native/media-capture';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import {ProgressBarModule} from "angular-progress-bar"
//import { VideoCapturePlus} from '@ionic-native/video-capture-plus';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    ProgressBarModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,MediaCapture,Camera,File,FileChooser
  ]
})
export class AppModule {}
