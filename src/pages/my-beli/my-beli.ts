import {Component} from '@angular/core';

import {NavController, ModalController} from 'ionic-angular';

import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { EditProfilePage } from "../edit-profile/edit-profile";
import { DefaultPage } from "../default/default";
import { StripePage } from "../stripe-page/stripe";
import { ContactusPage } from "../contactus/contactus";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppRate } from '@ionic-native/app-rate';

@Component({
  selector: 'page-my-beli',
  templateUrl: 'my-beli.html',
  providers:[SocialSharing,AppRate]
})
export class MyBeliPage {

  subject : string = 'Save time with Foodorder';

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public constants: ConstantsProvider, public modalCtrl: ModalController, private iab: InAppBrowser,private socialSharing: SocialSharing,private appRate: AppRate) {

  }

  ionViewWillLeave()
  {
    this.globalService.menuShow = true;
    this.globalService.headerShow = true;
  }
  ionViewWillEnter()
  {
    this.globalService.menuShow = true;
    setTimeout(()=>{
      this.globalService.headerShow = false;
    },500);
  }
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad My profile');
    if(this.globalService.access_token == null || this.globalService.access_token == '')
    {
        this.showModal();
    }
  }

  windowOpen(val)
  {
    if(val == "faq") this.iab.create('https://www.beli.co.uk/faq/','_system',{location:'yes'});
    if(val == "tc") this.iab.create('https://www.beli.co.uk/terms/','_system',{location:'yes'});
    if(val == "pc") this.iab.create('https://www.beli.co.uk/privacy/','_system',{location:'yes'});
  }

editProfile()
{
  this.navCtrl.push(EditProfilePage);
}
PaymentMethod()
{
  this.navCtrl.push(StripePage);
}

socialSharingEmail()
{
  this.socialSharing.shareViaEmail('', this.subject, ['beli@foodordering.org']).then(() => {
    // Success!
  }).catch(() => {
    // Error!
  });
}
contactFunction()
{
  this.navCtrl.push(ContactusPage);
}

appRating()
{
this.appRate.preferences.storeAppURL = {
  ios: '<app_id>',
  android: 'market://details?id=<package_name>',
  windows: 'ms-windows-store://review/?ProductId=<store_id>'
};
this.appRate.promptForRating(true);
}
showModal() {
    let modal = this.modalCtrl.create(DefaultPage);
    modal.onDidDismiss(data => {
        console.log('page > modal dismissed > data > ', data);
        if(data){

        }
    })
    modal.present();
}

}
