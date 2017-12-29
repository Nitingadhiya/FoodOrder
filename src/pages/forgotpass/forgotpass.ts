import { Component } from '@angular/core';
import {  NavController, ViewController, ModalController , AlertController} from 'ionic-angular';

import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConstantsProvider } from "../../providers/constants/constants";
import { GlobalVarService } from '../../providers/constants/global-var';
import { DefaultPage } from "../default/default";

@Component({
  selector: 'page-forgotpass',
  templateUrl: 'forgotpass.html',
})
export class ForgotPassPage {
  forgetform: FormGroup;
  userdata: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public apiservice: ApiServicesProvider,public viewCtrl: ViewController, public globalService : GlobalVarService, public modalCtrl: ModalController, public alertCtrl : AlertController,public constants: ConstantsProvider) {
    this.forgetform = formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.required, Validators.maxLength(100)])],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  forget(email) {
    this.apiservice.forgotpass(email).subscribe((data) => {

    let alert = this.alertCtrl.create({
      title: 'FoodOrder',
      subTitle: 'Password Reset link has been sent, Kindly Please check your email.',
      buttons: [{
     text: 'Ok',
     handler: () => {
      alert.dismiss();
      setTimeout(()=>{
       this.viewCtrl.dismiss();
      },500);
       this.showModal();
       }
       }]
    });
    alert.present();
    this.userdata = data;

    },(err)=>{
      this.viewCtrl.dismiss();
    });
  }

  dismiss()
  {
    this.viewCtrl.dismiss();
  }

  showModal() {
      let modal = this.modalCtrl.create(DefaultPage);
      modal.onDidDismiss(data => {
          if(data){}
      })
      modal.present();
  }
}
