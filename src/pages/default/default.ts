import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,ViewController,Slides,AlertController,ModalController,Platform } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";

import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { LoginPage } from  '../login/login';
import { Geolocation } from '@ionic-native/geolocation';
import {Push, PushObject, PushOptions} from "@ionic-native/push";

@Component({
  selector: 'page-default',
  templateUrl: 'default.html',
  providers:[Push]
})
export class DefaultPage {

  @ViewChild(Slides) slides: Slides;
  task_interval :any='';
  currentIndex : number =0;

  constructor(public navCtrl: NavController,public constants: ConstantsProvider, public navParams: NavParams, public apiservice: ApiServicesProvider,  public globalService : GlobalVarService, public viewCtrl: ViewController,public alertCtrl : AlertController,public modalCtrl :ModalController,private geolocation: Geolocation, public push: Push,public platform: Platform) {

  }

 goToSlide() {
   this.slides.slideTo(1, 500);
 }
  slideChanged()
  {
     this.currentIndex = this.slides.getActiveIndex();
     if(this.currentIndex == 2)
     {
       this.initPushNotification();
     }
   }

  ionViewDidEnter() {
    console.log('ionViewDidLoad DefaultPage');
    if(localStorage.getItem('walk_screen') == '2')
    {
      this.slides.slideTo(2,0);
    }
  }

  dismiss()
  {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 100, timeout: 60000 }).then((resp) => {
       this.globalService.latitude  = resp.coords.latitude;
       this.globalService.longitude = resp.coords.longitude;
       localStorage.setItem('latitude',this.globalService.latitude);
       localStorage.setItem('longitude',this.globalService.longitude);
       clearInterval(this.task_interval);
      }).catch((error) => {
    });
     localStorage.setItem('walk_screen','2');
    this.viewCtrl.dismiss();
  }

  signUp() {
     localStorage.setItem('walk_screen','2');
    this.globalService.showSignupModal();
    setTimeout(()=>{
      this.viewCtrl.dismiss();
    },500);
  }

  signIn() {
     localStorage.setItem('walk_screen','2');
    this.showLoginModal();
    setTimeout(()=>{
      this.viewCtrl.dismiss();
    },1000);
  }

  showLoginModal() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(data => {
        console.log('page > modal dismissed > data > ', data);
        if(data){

        }
    })
    modal.present();
  }

  notificationPermission()
  {
    this.initPushNotification();
    this.slides.slideTo(2, 500);
  }

  initPushNotification()
  {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
      const options: PushOptions = {
        android: {
          senderID: "845044982643"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      };
      const pushObject: PushObject = this.push.init(options);

      pushObject.on('registration').subscribe((data: any) => {
        console.log("device token ->", data.registrationId);
        this.globalService.deviceToken = data.registrationId;
        //TODO - send device token to server
      });

      pushObject.on('notification').subscribe((data: any) => {
        console.log('message', data.message);
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
        } else {

          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          //this.nav.push(DetailsPage, {message: data.message});
          console.log("Push notification clicked");
        }
      });

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
}
