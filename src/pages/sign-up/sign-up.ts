import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Platform,ModalController } from 'ionic-angular';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GlobalVarService } from '../../providers/constants/global-var';
import { BrandPage } from "../brand/brand";
import { DefaultPage } from "../default/default";
/**
 * Generated class for the SignUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signupform: FormGroup;
  userdata: any;
  passwordRegex: any = '((?=.*[0-9])(?=.*[a-zA-Z]).{6,24})';//"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$";
  //(?=.*[A-Z])
  //[0-9]{1,}[a-zA-Z]{2,}[0-9]{6,}


  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public apiservice: ApiServicesProvider, public navParams: NavParams, public constants: ConstantsProvider, public viewCtrl: ViewController,public globalService : GlobalVarService,public platform: Platform,public modalCtrl : ModalController) {
    this.signupform = formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
      'tel': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      'email': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(this.passwordRegex)])],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  sign_footer(avatar_url, email, phone_number, name, password)
  {
    this.signup(avatar_url, email, phone_number, name, password);
  }

  signup(avatar_url, email, phone_number, name, password) {
    this.globalService.showLoader();
    this.apiservice.signup(avatar_url, email, phone_number, name, password).subscribe((data) => {
      this.userdata = data;
      //this.navCtrl.push('LoginPage');
      this.login(email,password,'password');
    },(err)=>{
      this.globalService.hideLoader();
    });

  }
  dismiss()
  {
    this.showModal_default();
    setTimeout(()=>{
      this.viewCtrl.dismiss();
    },500);
  }

  login(email,password,grant_type){
      this.apiservice.signin(email,password,grant_type).subscribe((data)=>{
        this.globalService.hideLoader();
      this.userdata = data;
      localStorage.setItem('access_token',this.userdata.access_token);
      localStorage.setItem('refresh_token',this.userdata.refresh_token);
      localStorage.setItem('token_type',this.userdata.token_type);
      this.globalService.access_token = this.userdata.access_token;
      this.globalService.token_type = this.userdata.token_type;
      this.viewCtrl.dismiss();
      this.get_brand_name();
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

  get_brand_name()
  {
    //this.globalService.showLoader();
    this.apiservice.GetBrandName().subscribe((data)=>{
      //this.globalService.hideLoader();
      this.navCtrl.setRoot(BrandPage);
      this.globalService.brand_name = data.name;
      this.globalService.brand_id = data.brands;
      let logo_small = data.logo_small;
      this.globalService.brand_logo = logo_small;
      localStorage.setItem('brand_logo',this.globalService.brand_logo);
      this.pushnotification_device();
      //this.resturant_list();
    },(err) => {
      //this.globalService.hideLoader();
    });
  }

  pushnotification_device()
  {
    var data = {'id':this.globalService.deviceToken}
    this.apiservice.push_token(data).subscribe((result)=>{
      console.log(JSON.stringify(result));
    },(err) => {
      console.log(err);
    });
  }
  showModal_default() {
      let modal = this.modalCtrl.create(DefaultPage);
      modal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){

          }
      })
      modal.present();
  }
  /*ngOnDestroy() {
    if (this.onShowSubscription) {
      this.onShowSubscription.unsubscribe();
    }
    if (this.onHideSubscription) {
      this.onHideSubscription.unsubscribe();
    }
  }

  private onShow(e) {
    this.keyboard.disableScroll(true);
    let keyboardHeight: number = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
    //this.setElementPosition(keyboardHeight);
    this.keyboard_height = keyboardHeight;
  };

  private onHide() {
    this.keyboard.disableScroll(false);
    //this.setElementPosition(0);
    this.keyboard_height = 0;
  };

  private setElementPosition(pixels: number) {
    this.elementRef.nativeElement.style.paddingBottom = pixels + 'px';
    this.content.resize();
  }*/
}
