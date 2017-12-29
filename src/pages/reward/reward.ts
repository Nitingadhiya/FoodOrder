import {Component} from '@angular/core';

import {NavController, NavParams, Platform, AlertController} from 'ionic-angular';


import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";


@Component({
  selector: 'page-reward',
  templateUrl: 'reward.html'
})
export class RewardPage {

  reward: any= '';
  reward_product : Array<{}>=[];
  stamps_required : any = 0;
  user_progress : any = 0;
  user_can_redeem : boolean = false;
  line_items_array : Array<{}>=[];
  add_basket : Array<{}>=[];
  buttonDisabled :boolean = true;

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public platform: Platform, public navParams: NavParams, public apiservice: ApiServicesProvider, public constants: ConstantsProvider,public alertCtrl : AlertController) { }

  ionViewDidLoad()
  {
    this.reward = this.globalService.rewards_brand;
    this.stamps_required = this.reward.stamps_required;
    this.user_progress = this.reward.user_progress;
    this.user_can_redeem = this.reward.user_can_redeem;
    if(this.user_can_redeem)
    {
      this.buttonDisabled =null;
    }
    this.reward_product = this.reward.reward_products;
  }


  add_to_basket(data)
  {
    if(!this.globalService.merchant_isopen)
    {
        const alert = this.alertCtrl.create({
          title: 'Basket',
          subTitle: 'Merchant Closed',
          buttons: ['Dismiss']
        });
        alert.present();

        return false;
    }

    this.add_basket = this.globalService.product_cart;
    this.line_items_array.push({'product_name':data.name,'quantity':1,'special_request':'','product':data.id,'variations':'','total_price':data.price});

    this.add_basket.push({'merchant':this.globalService.merchant_id,'line_items':this.line_items_array,'collection_time':'','user':this.globalService.user_id,'reward_product':data.id});

    this.globalService.product_cart = this.add_basket;
    this.quotes_api();
  }

  quotes_api()
  {
      var obj={};
      var variation =[];
      var quotes_array=[];
      var product_reward ='';
      for(var ng=0;ng<this.globalService.product_cart.length;ng++)
      {
        product_reward = this.globalService.product_cart[ng].reward_product;
        variation = this.globalService.product_cart[ng].line_items[0].variations;
          if(variation)
          {
            var multichoice_val=[];
            for(var jk =0;jk<variation.length;jk++)
            {
                if(variation[jk].type == 'multichoice')
                {
                  multichoice_val.push(variation[jk].value);
                  obj[variation[jk].key_name] = multichoice_val;
                }
                else if(variation[jk].value && variation[jk].type != 'boolean')
                {
                  obj[variation[jk].key_name] = variation[jk].value;
                }
                else
                {
                  obj[variation[jk].key_name] = true;
                }
            }
          }
          quotes_array.push({"product":this.globalService.product_cart[ng].line_items[0].product,"quantity":this.globalService.product_cart[ng].line_items[0].quantity,"special_request":this.globalService.product_cart[ng].line_items[0].special_request,"variations":obj})
      }
      var data ={};
      if(product_reward == '')
      {
        data ={
          "line_items": quotes_array,
          "merchant": this.globalService.product_cart[0].merchant,
        }

      }
      else
      {
        data ={
            "reward": product_reward,
            "line_items": quotes_array,
            "merchant": this.globalService.product_cart[0].merchant,
          }
      }

    this.globalService.showLoader();
    this.apiservice.send_quotes_basket(data).subscribe((data)=>{
      this.globalService.hideLoader();
      var data_total = data;
      this.buttonDisabled =true;
      if(data_total.total)
      {
        this.globalService.cart_total = data_total.total;
      }
    },(err) => {
        this.globalService.hideLoader();
    });
  }

}
