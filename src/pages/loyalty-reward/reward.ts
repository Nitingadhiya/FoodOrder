import {Component} from '@angular/core';
import {NavController, NavParams, Platform, ModalController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { ModalRedeemPage } from  '../modal-redeem/redeem';


@Component({
  selector: 'page-loyalty-reward',
  templateUrl: 'reward.html'
})
export class LoyaltyRewardPage {
  Brand_Id : any = 0;
  data_list : any[] =[];
  rewards_list: Array<{}>=[];
  data_array : any[] =[];
  stamps_required : any = 0;
  user_progress : any = 0;
  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public platform: Platform, public navParams: NavParams, public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl: ModalController) {
      this.Brand_Id = this.navParams.get('brand_id');
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
    console.log("LoyalityReward Page");
    this.GetRewardsScreen();
  }

  GetRewardsScreen()
  {
    this.globalService.showLoader();
      this.apiservice.GetRewards_list().subscribe((data)=>{
      this.data_list = data;
      this.data_array = this.data_list;

      for(var i=0;i<this.data_list.length;i++)
      {
        if(this.Brand_Id == this.data_list[i].brand)
        {
          this.rewards_list = this.data_list[i].reward_products;
          this.stamps_required = this.data_list[i].stamps_required;
          this.user_progress = this.data_list[i].user_progress;
        }
      }
          this.globalService.hideLoader();
        },(err) => {
          if(this.globalService.loading != undefined){
              this.globalService.hideLoader();
          }
      });
  }

  showModal(item_data) {
      let modal = this.modalCtrl.create(ModalRedeemPage,{item_data:item_data,stamps_required:this.stamps_required,user_progress:this.user_progress});
      modal.onDidDismiss(data => {
      })
      modal.present();
  }

}
