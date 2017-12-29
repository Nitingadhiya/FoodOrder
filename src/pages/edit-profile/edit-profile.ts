import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { ChangePasswordPage } from "../change-password/change-password";

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

  name : string = '';
  email :string = '';
  phonenumber : any=''

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public apiservice: ApiServicesProvider, public constants: ConstantsProvider) {  }

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
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad EditProfielpage');
    this.getProfileDetails();
  }
  getProfileDetails()
  {
    this.globalService.showLoader();
    this.apiservice.GetProfileInfo().subscribe((data)=>{
      this.globalService.hideLoader();
      this.name = data.name;
      this.phonenumber = data.phone_number;
      this.email = data.email;
      this.globalService.avatar_url = data.avatar_url;
      this.globalService.profile_name = data.name;
      this.globalService.avatar_url = data.avatar_url
    },(err) => {
        this.globalService.hideLoader();
    });
  }
  updateProfile()
  {
    var data ={'phone_number': this.phonenumber, 'email':this.email,'name':this.name}
    this.globalService.showLoader();
    this.apiservice.UpdateProfileInfo(data).subscribe((data)=>{
      this.globalService.hideLoader();
    },(err) => {
      this.globalService.hideLoader();
    });
  }

  changePassword()
  {
    this.navCtrl.push(ChangePasswordPage);
  }
}
