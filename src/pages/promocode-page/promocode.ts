import {Component} from '@angular/core';

import { NavController,NavParams, Platform,AlertController} from 'ionic-angular';

import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";

@Component({
  selector: 'page-promocode',
  templateUrl: 'promocode.html'
})
export class PromoCodePage {
  promocode : string ='';
  promocode_Data :any[] = [];

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public platform: Platform,public navParams: NavParams,public apiservice: ApiServicesProvider, public constants: ConstantsProvider,private alertCtrl : AlertController) {  }

  ionViewWillLeave()
  {
    this.globalService.menuShow = true;
    this.globalService.headerShow = true;
  }
  ionViewWillEnter()
  {
    this.globalService.menuShow = true;
    this.globalService.headerShow = false;
  }

  ionViewDidLoad() {
    this.get_promocode();
  }
  get_promocode()
  {
    this.globalService.showLoader();
    this.apiservice.get_promotions().subscribe((data)=>{
      console.log(data);
      if(data.length == 0)
      {
        this.globalService.presentToast("Not Found List Of Promocode. ")
      }else{
        var result = data;
        this.promocode_Data = result;
      }
      this.globalService.hideLoader();

    },(err) => {
      this.globalService.hideLoader();
    });
  }
  applied_promocode()
  {
    if(!this.promocode)
    {
      const alert = this.alertCtrl.create({
        title: 'Enter Promocode',
        subTitle: 'Please Enter promocode',
        buttons: ['Dismiss']
      });
      alert.present();
    }
    else
    {
      //var data_promo = this.promocode;
      //.toUpperCase()
      var data = {'code':this.promocode};
      this.globalService.showLoader();
      this.apiservice.promotions(data).subscribe((data)=>{
        this.globalService.hideLoader();
        this.get_promocode();
      },(err) => {
        this.globalService.presentToast("Promotion does not exist");
        this.globalService.hideLoader();
      });
    }
  }

}
