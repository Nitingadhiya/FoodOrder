import { Component } from '@angular/core';
import { ViewController,LoadingController, NavParams, NavController} from 'ionic-angular';
import { GlobalVarService } from '../../providers/constants/global-var';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Component({
    selector: 'modal-redeem-now',
    templateUrl: 'redeem-now.html'
})
export class ModalRedeemNow{
  item_data : any = '';
  Redeem_Now : any='';
  countDown;
  counter :any = 15*60;
  tick = 1000;
  reward_code : any ='';

    constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController , public navParams :  NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public navCtrl: NavController, public constants: ConstantsProvider) {
      this.item_data = this.navParams.get('data');
        this.countDown = Observable.timer(0, this.tick)
        .take(this.counter)
        .map(() =>{ --this.counter; console.log(this.counter); })
      if(!localStorage.getItem('counter_timer'))
      {
        this.counter=900;
      }
    }

    ionViewDidLoad()
    {
      console.log(this.globalService.countDown);
      console.log("Redeem ****"+JSON.stringify(this.item_data));
      if(localStorage.getItem('reward_code'))
      {
        this.item_data = JSON.parse(this.item_data);
        this.Redeem_Now =1;
        window.document.querySelector('modal-redeem-now').classList.add('margin_disble');
        window.document.querySelector('modal-redeem-now').classList.add('class-modal-size');
        this.reward_code = localStorage.getItem('reward_code');
        console.log(this.counter);
        if(localStorage.getItem('counter_timer'))
        {
          console.log(this.counter+"native");
          console.log( eval(localStorage.getItem('counter_timer'))+"eval");
          this.counter = this.counter - eval(localStorage.getItem('counter_timer'));
        }
        console.log("Counter"+this.counter);
        this.countDown = Observable.timer(0, this.tick)
        .take(this.counter)
        .map(() => --this.counter)
      }

    }

    ionViewWillLeave()
    {
      //localStorage.setItem('counter_timer',this.counter);
    }

    closePage()
    {
      this.globalService.rewards_brand.user_progress =0;
      this.viewCtrl.dismiss('0');
    }

    redeemNow()
    {
      this.globalService.showLoader();
      console.log(this.item_data.id);
      var data = {
           'activity': 'redeemed_stamps_in_store',
           "brand": this.globalService.brand_id[0],
           'extra_data':  {
           'product': this.item_data.id
           }
        }
        console.log(JSON.stringify(data));
      this.apiservice.postactivity(data).subscribe((result)=>{
        localStorage.setItem('reward_data',JSON.stringify(this.item_data));
        if(this.countDown)
        {
          this.countDown = Observable.timer(0, this.tick)
          .take(this.counter)
          .map(() => --this.counter)
        }
        else
        {
          this.countDown = 900;
        }
        localStorage.setItem('counter_timer',this.counter);
        this.globalService.hideLoader();
        window.document.querySelector('modal-redeem-now').classList.add('class-modal-size');
          this.Redeem_Now =1;
          let extra_data = result.extra_data;
          this.reward_code = extra_data.reward_code;
          this.globalService.reward_code = this.reward_code;
          localStorage.setItem('reward_code',this.reward_code);
          var date_D = new Date().getTime();
          localStorage.setItem('save_date',date_D+'');
      },(err) => {
        this.globalService.presentToast("Not enough stamps to redeem a reward");
        this.globalService.hideLoader();
      });

    }

}
