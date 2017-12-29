import {Component} from '@angular/core';
import {NavController, NavParams, Platform,AlertController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoyaltyPage } from  '../loyalty/loyalty';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

@Component({
  selector: 'page-stamp',
  templateUrl: 'stamp.html',
  providers:[QRScanner]
})
export class StampPage {

Qrscan_value :any = '';
collect_stamp_show : number=0;
  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public platform: Platform, public navParams: NavParams, public apiservice: ApiServicesProvider, public constants: ConstantsProvider,private qrScanner: QRScanner,public openNativeSettings : OpenNativeSettings,public alertCtrl : AlertController) {  }

  backPage()
  {
    this.navCtrl.pop();
  }
  ionViewWillLeave()
  {
    this.globalService.menuShow = true;
    this.globalService.headerShow = true;
  }
  ionViewWillEnter()
  {
    this.globalService.menuShow = false;
    setTimeout(()=>{
      this.globalService.headerShow = false;
    },this.globalService.navigationTime);
  }
  ionViewDidLoad() {
    console.log("Collect stamp Page");
    window.document.querySelector('ion-app').classList.add('transparentBody');
    window.document.querySelector('page-brand').classList.add('dis_none');
    setTimeout(()=>{
      this.collect_stamp_show = 1;
    },1000);
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
       // camera permission was granted
       console.log("camera permission was granted")
       window.document.querySelector('ion-app').classList.add('transparentBody');
       window.document.querySelector('page-brand').classList.add('dis_none');
       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: any) => {
         this.Qrscan_value=text;
         setTimeout(()=>{
           window.document.querySelector('ion-app').classList.remove('transparentBody');
           window.document.querySelector('page-brand').classList.remove('dis_none');
         },300)
         this.qrscanApi();
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();
       // wait for user to scan something, then the observable callback will be called

     } else if (status.denied) {
       console.log("denied")
        window.document.querySelector('ion-app').classList.remove('transparentBody');
        window.document.querySelector('page-brand').classList.remove('dis_none');
       // camera permission was permanently denied
     } else {
       window.document.querySelector('page-brand').classList.remove('dis_none');
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) =>{
    console.log('Error is', e);
    let alert = this.alertCtrl.create({
      title: 'Allow Permission',
      cssClass:'Bluetooth_permission',
      message: 'This app requires camera access to function properly.',
      buttons: [
        {
          text: 'Deny',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openNativeSettings.open("application_details");
          }
        }
      ]
    });
    alert.present();
  });
  }

  cancel()
  {
    this.navCtrl.pop();
  }

  ionViewDidLeave() {
    setTimeout(()=>{
      window.document.querySelector('ion-app').classList.remove('transparentBody');
      window.document.querySelector('page-brand').classList.remove('dis_none');
    },300);
  }

  qrscanApi()
  {
    this.globalService.showLoader();
    var data = {
         'activity': 'manual_stamp',
         'extra_data':  {
         'unique_code': this.Qrscan_value
         }
      }
    this.apiservice.postactivity(data).subscribe((result)=>{
      this.globalService.hideLoader();
      this.navCtrl.push(LoyaltyPage,{brand_id:this.globalService.brand_id});
    },(err) => {
      this.globalService.hideLoader();
      this.navCtrl.push(LoyaltyPage,{brand_id:this.globalService.brand_id});
    });

  }
}
