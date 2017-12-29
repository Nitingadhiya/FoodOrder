import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { MyBeliPage } from "../my-beli/my-beli";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})

export class ChangePasswordPage {

  new_password : any = '';
  confirm_password :any = '';
  signupform: FormGroup;
  passwordRegex: any = '((?=.*[0-9])(?=.*[a-zA-Z]).{6,24})';

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public formBuilder: FormBuilder) {
    this.signupform = formBuilder.group({
      'new_password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(this.passwordRegex)])],
      'confirm_password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(this.passwordRegex)])],
    });
  }

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
    console.log('ionViewDidLoad Change password page');
  }

  updatePassword(new_password,confirm_password)
  {
    if(this.new_password != this.confirm_password)
    {
      this.globalService.presentToast('Your password and confirmation password do not match');
      return false;
    }
    var data ={'password': this.new_password};
    this.globalService.showLoader();
    this.apiservice.SetPassword(data).subscribe((data)=>{
      this.globalService.hideLoader();
      this.navCtrl.push(MyBeliPage);
      this.globalService.avatar_url = data.avatar_url
    },(err) => {
        this.globalService.hideLoader();
    });
  }
}
