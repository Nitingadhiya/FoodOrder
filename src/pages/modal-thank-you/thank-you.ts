import { Component } from '@angular/core';
import { ViewController,LoadingController, NavParams, Platform,NavController, AlertController} from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrandPage} from  '../brand/brand';
import { ConstantsProvider } from "../../providers/constants/constants";
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../home/home';
import { ReceiptsDetailsPage} from  '../receipts-details/receipts-details';

@Component({
    selector: 'modal-thank-you',
    templateUrl: 'thank-you.html'
})
export class ModalThankYouPage{
  item_data : any = '';
  collection_time : any = '';
  preparation_time : any = '';
  merchant_address : string = '';
  merchant_latitude : any ='';
  merchant_longitude : any='';
  platform_name : string = '';

  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController , public navParams :  NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public navCtrl: NavController, public alertCtrl : AlertController,public platform: Platform,private iab: InAppBrowser, public constants: ConstantsProvider,private diagnostic: Diagnostic,private openNativeSettings: OpenNativeSettings) {
      this.item_data = this.navParams.get('order_data');
      platform.ready().then(() => {

              if (this.platform.is('android')) {
                this.platform_name = "android";
                  console.log("running on Android device!");
              }
              if (this.platform.is('ios')) {
                  console.log("running on iOS device!");
                  this.platform_name = "ios";
              }
              if (this.platform.is('mobileweb')) {
                  console.log("running in a browser on mobile!");
              }

          });
    }
    ionViewWillLeave()
    {
      this.globalService.menuShow = false;
      this.globalService.headerShow = true;
    }
    ionViewWillEnter()
    {
      this.globalService.menuShow = false;
      this.globalService.headerShow = false;
    }
    ionViewDidLoad() {
      this.merchant_address= this.globalService.merchant_info.address;
      var preparation_time = this.item_data.collection_time;
      var splt_p = preparation_time.split('T');
      var time_p = splt_p[1].split(':');
      let minte_time :any = parseFloat(time_p[1]);// + eval(this.globalService.collection_TIME);
      var hou_t = time_p[0];
      if(minte_time >= 60)
      {
        minte_time = minte_time - 60;
        hou_t = parseFloat(hou_t)+1;
        if(hou_t < 10)
        {
          hou_t = "0"+hou_t;
        }
      }
      if(minte_time < 10)
      {
        minte_time = "0"+minte_time;
      }
      var pt = hou_t+":"+minte_time;
       this.preparation_time = pt;
      let seco_minute :any = parseFloat(minte_time) + 5;
      if(seco_minute >= 60)
      {
        seco_minute = seco_minute - 60;
        hou_t = parseFloat(hou_t)+1;
      }
      if(seco_minute < 10)
      {
        seco_minute = '0'+seco_minute;
      }
      var ct = hou_t +":"+ seco_minute;
      this.collection_time = ct;

      if (this.platform.is('ios')) {
     setTimeout(()=>{
     this.diagnostic.getBluetoothState()
       .then((state) => {
         if (state == this.diagnostic.bluetoothState.POWERED_ON){
           // do something
           //An app wants to turn on Bluetooth ON for the device.
         } else {
           let alert = this.alertCtrl.create({
             title: 'Please switch on bluetooth',
             cssClass:'Bluetooth_permission',
             message: "We use bluetooth to 'check in' automatically when you arrive to collect your order",
             buttons: [
               {
                 text: "Don't Allow",
                 role: 'cancel',
                 handler: () => {
                   console.log('Cancel clicked');
                 }
               },
               {
                 text: 'Settings',
                 handler: () => {
                   this.openNativeSettings.open("bluetooth");
                 }
               }
             ]
           });
           alert.present();
         }
       }).catch(e => console.error(e));
     },1000);
   }

    }
    closePage()
    {
      this.globalService.recipe_page = true;
      //this.navCtrl.push(HomePage);
      this.navCtrl
        .push(ReceiptsDetailsPage,{id:this.item_data.id})
        .then(() => {

            const index = this.viewCtrl.index;

            for(let i = index; i > 0; i--){
                this.navCtrl.remove(i);
            }

        });
        /*let Mlen :any =localStorage.getItem('merchant_length');
        if(Mlen > 1)
        {
          localStorage.setItem('supertab_selected','0')
        }
        else
        {
          localStorage.setItem('supertab_selected','1')
        }*/

    }

    launchApp()
    {
      this.merchant_address = this.globalService.merchant_info.address;
      this.merchant_latitude = this.globalService.merchant_info.lat;
      this.merchant_longitude = this.globalService.merchant_info.long;
      if(this.platform_name == "ios")
      {
        this.iab.create('maps://'+this.merchant_latitude+','+this.merchant_longitude+'?q='+this.merchant_address,'_system',{location:'yes'});
      }
      else
      {
        this.iab.create('geo:'+this.merchant_latitude+','+this.merchant_longitude+'?q='+this.merchant_address,'_system',{location:'yes'});
      }
    }
}
