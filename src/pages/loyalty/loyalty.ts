import {Component} from '@angular/core';
import {NavController, NavParams, Platform, ModalController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { ModalRedeemPage } from  '../modal-redeem/redeem';
import { StampPage } from  '../collect-stamp/stamp';
import { BrandPage } from  '../brand/brand';
import { ModalRedeemNow } from "../modal-redeem-now/redeem-now";

@Component({
  selector: 'page-loyalty',
  templateUrl: 'loyalty.html'
})
export class LoyaltyPage {

  Brand_Id :any = 0;
  user_progress : any = 0;
  stamps_required : any = 0;
  item_data : any[] = [];
  buttonDisabled = true;
  saved_Date :any;
  loader_show : boolean =false;
  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public platform: Platform, public navParams: NavParams, public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl : ModalController) {
    this.Brand_Id = this.navParams.get('brand_id');
    this.globalService.brand_id = this.Brand_Id;
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
    },this.globalService.navigationTime);
  }
  ionViewDidLoad() {
    console.log("Loyalty Page");
    let Reward_D = localStorage.getItem('Reward_program');
    if(Reward_D)
    {
      let re_program = JSON.parse(Reward_D);
      console.log(re_program);
      this.globalService.rewards_brand = re_program;
      this.user_progress = re_program.user_progress;
      this.stamps_required = re_program.stamps_required;
      this.loader_show =true;
    }
    this.GetStamps();
    if(this.globalService.countDown == 0)
    {
      this.buttonDisabled = null;
      this.globalService.countDown=1;
    }
    if(localStorage.getItem('save_date'))
    {
      this.saved_Date = eval(localStorage.getItem('save_date'));
      var time = new Date().getTime() - this.saved_Date;
      var sec = Math.floor((time/1000) % 60);
      var min_se = Math.floor((time/1000/60) << 0);

      var count_t = sec;
      if(min_se)
      {
        count_t = (min_se*60)+sec;
      }
      localStorage.setItem('counter_timer',count_t+'');
    }
  }

  GetStamps()
  {
    if(this.loader_show == false)
    {
      this.globalService.showLoader();
    }
      this.apiservice.GetMerchantName(this.Brand_Id).subscribe((data)=>{
        this.item_data = data.reward_program;
        let reward_program = data.reward_program;
        this.globalService.rewards_brand = data.reward_program;
        this.user_progress = reward_program.user_progress;
        this.stamps_required = reward_program.stamps_required;
        if(this.stamps_required <= this.user_progress)
        {
          this.buttonDisabled = null;
        }
        if(localStorage.getItem('counter_timer'))
        {
          if(eval(localStorage.getItem('counter_timer')) < 900)
          {
            this.buttonDisabled = null;
          }
          if(eval(localStorage.getItem('counter_timer')) >= 900)
          {
            localStorage.removeItem('counter_timer');
            localStorage.removeItem('reward_code');
            localStorage.removeItem('reward_data');
            localStorage.removeItem('save_date');
          }
        }

        if(this.loader_show == false)
        {
          this.globalService.hideLoader();
        }
        },(err) => {
          if(this.loader_show == false)
          {
            this.globalService.hideLoader();
          }
      });
  }
  viewRedeemScreen()
  {
    if(localStorage.getItem('save_date'))
    {
      this.saved_Date = eval(localStorage.getItem('save_date'));
      var time = new Date().getTime() - this.saved_Date;
      var sec = Math.floor((time/1000) % 60);
      var min_se = Math.floor((time/1000/60) << 0);

      var count_t = sec;
      if(min_se)
      {
        count_t = (min_se*60)+sec;
      }
      localStorage.setItem('counter_timer',count_t+'');
    }

    if(localStorage.getItem('counter_timer'))
    {
      if(eval(localStorage.getItem('counter_timer')) < 900)
      {
        this.showModalRedeemNow();
      }
      else{
        this.showModal(this.item_data);
        localStorage.removeItem('counter_timer');
        localStorage.removeItem('reward_code');
        localStorage.removeItem('reward_data');
        localStorage.removeItem('save_date');
      }
    }else
    {
      this.showModal(this.item_data);
      localStorage.removeItem('counter_timer');
      localStorage.removeItem('reward_code');
      localStorage.removeItem('reward_data');
      localStorage.removeItem('save_date');

    }
  }
  backPage()
  {
    this.navCtrl.setRoot(BrandPage);
  }

  collectStamp()
  {
    this.navCtrl.push(StampPage);
  }

  showModal(item_data) {
      let modal = this.modalCtrl.create(ModalRedeemPage,{data : item_data});
      modal.onDidDismiss(data => {

      })
      modal.present();
  }

  showModalRedeemNow() {
    var get_data = localStorage.getItem('reward_data');
      let modal = this.modalCtrl.create(ModalRedeemNow,{data:get_data});
      modal.onDidDismiss(data => {
          if(data){
            if(data == '0')
            {
                this.user_progress =0;
            }
          }
      })
      modal.present();
  }

}
