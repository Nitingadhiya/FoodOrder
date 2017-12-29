import { Injectable } from '@angular/core';
import { Platform ,LoadingController, ToastController, ModalController} from 'ionic-angular';
import 'rxjs/add/operator/map';
//import { LoginPage } from "../../pages/login/login";

@Injectable()
export class GlobalVarService  {

  public placeholderImg='http://placehold.it/360x200';
  public access_token : string = localStorage.getItem('access_token');
  public token_type :string = localStorage.getItem('token_type') || 'Bearer';
  public brand_name : string = '';
  public brand_logo : string = localStorage.getItem('brand_logo') || '';
  public menuId :string = '';
  public merchant_info : any;
  public loading :any;
  public map_merchant : any;
  public latitude : any;
  public longitude : any;
  public merchant_isopen : any;
  public merchant_id :any;
  public product_cart : any[] =[];
  public user_id : number = 0;
  public card_info : any;
  public avatar_url : any = ''
  public profile_name : string ='';
  public data_limit :number =10;
  public currency_symbol :any = '&#163;';
  public MerchantList :any='';
  public rewards_brand : any='';
  public cart_total :any =0;
  public payment_order_item : any = {};
  public rootV : any;
  public brand_id : any = 0;
  public device_width = 0;
  public device_height =0;
  public countDown : any = 1;
  public reward_code :any = 0;
  public temp_page : string = 'Home';
  public contact_email : string ='';
  public contact_phone : string ='';
  public oncetime : number =0;
  public keyboard_height :number =0;
  public deviceToken : string ='';
  public collection_TIME :any =0;
  public recipe_page : boolean = false;
  public toastShow : boolean = false;
  public connectivity :string = " No internet connection :(";
  public favourites_local :any[]=[];
  public menuShow : boolean = true;
  public headerShow : boolean = true;
  public navigationTime : number = 1200;
  public merchant_site : any = localStorage.getItem('merchant_length') || 1;
  constructor(platform: Platform, public loadingCtrl: LoadingController, private toastCtrl: ToastController,  public modalCtrl: ModalController) {
    platform.ready().then((readySource) => {
      this.device_width = platform.width();
      this.device_height = platform.height();
    });
  }

    showSignupModal() {
      let modal = this.modalCtrl.create('SignUpPage');
      modal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){

          }
      })
      modal.present();
    }

    /*showLoginModal() {
      let modal = this.modalCtrl.create(LoginPage);
      modal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){

          }
      })
      modal.present();
    }
*/
  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });

    this.loading.present();
  }
  hideLoader()
  {
    this.loading.dismiss();
  }

  presentToast(msg) {
    this.toastShow =true;
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton:true,
      closeButtonText : 'Close',
    });

    toast.onDidDismiss(() => {
      this.toastShow =false;
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
