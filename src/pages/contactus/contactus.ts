import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ConstantsProvider } from "../../providers/constants/constants";

@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
  providers:[SocialSharing]
})
export class ContactusPage {

  email :string = '';
  phonenumber : any=''
  subject : string = 'Save time with Foodorder';
  constructor(public navCtrl: NavController, public globalService : GlobalVarService,private socialSharing: SocialSharing, public constants: ConstantsProvider) {  }

  backPage()
  {
    this.navCtrl.pop();
  }
  ionViewWillLeave()
  {
    this.globalService.menuShow = false;
    this.globalService.headerShow = true;
  }
  ionViewWillEnter()
  {
    this.globalService.menuShow = false;
    setTimeout(()=>{
      this.globalService.headerShow = false;
    },this.globalService.navigationTime);
  }
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad Contactpage');
  }
  sendEmail()
  {
    this.socialSharing.shareViaEmail('', this.subject, [this.globalService.contact_email]).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
}
