import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConstantsProvider } from "../../providers/constants/constants";
import { GlobalVarService } from '../../providers/constants/global-var';
import { BrandPage } from "../brand/brand";
import { ForgotPassPage } from "../forgotpass/forgotpass";
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginform: FormGroup;
  userdata: any;

  constructor(public navCtrl: NavController,public formBuilder:FormBuilder,public apiservice: ApiServicesProvider, public navParams: NavParams, public globalService : GlobalVarService, public viewCtrl: ViewController,public modalCtrl: ModalController, private network: Network, public constants: ConstantsProvider) {
    this.loginform = formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.required, Validators.maxLength(100)])],
      'password': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
  });

  this.network.onConnect().subscribe(() => {
    console.log('network connected!');
    setTimeout(() => {
      if (this.network.type === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
      }
    }, 3000);
  });
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(email,password,grant_type){
    this.globalService.showLoader();
      this.apiservice.signin(email,password,grant_type).subscribe((data)=>{
      this.globalService.hideLoader();
      this.userdata = data;
      localStorage.setItem('access_token',this.userdata.access_token);
      localStorage.setItem('refresh_token',this.userdata.refresh_token);
      localStorage.setItem('token_type',this.userdata.token_type);
      this.globalService.access_token = this.userdata.access_token;
      this.globalService.token_type = this.userdata.token_type;
      this.viewCtrl.dismiss();
      this.getBrandName();
  },(err)=>{
    this.globalService.hideLoader();
    if(err == 'Error: 401')
    {
      this.globalService.presentToast("Invalid credentials given.");
    }else
    {
      this.globalService.presentToast("Bad Request");
    }
  });
  }
  goTOForgetPass(){
    this.showForgotModal();
      setTimeout(()=>{this.viewCtrl.dismiss();},500);
  }
  dismiss()
  {
    this.viewCtrl.dismiss();
  }

  showForgotModal() {
    let modal = this.modalCtrl.create(ForgotPassPage);
    modal.onDidDismiss(data => {
    })
    modal.present();
  }

  getBrandName()
  {
    this.apiservice.GetBrandName().subscribe((data)=>{
      this.navCtrl.setRoot(BrandPage);
      this.globalService.brand_name = data.name;
      this.globalService.brand_id = data.brands;
      let logo_small = data.logo_small;
      this.globalService.brand_logo = logo_small;
      localStorage.setItem('brand_logo',this.globalService.brand_logo);
      this.pushNotificationDevice();
    },(err) => {});
  }

  pushNotificationDevice()
  {
    var data = {'id':this.globalService.deviceToken}
    this.apiservice.push_token(data).subscribe((result)=>{
      console.log(JSON.stringify(result));
    },(err) => {
      console.log(err);
    });
  }

}
