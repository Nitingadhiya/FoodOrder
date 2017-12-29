import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ModalController, AlertController } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import {SuperTabs} from "../../ionic2-super-tabs/src/components/super-tabs";
import { MerchantMenuPage } from "../merchant-menu/merchant-menu";
import { MerchantInfoPage } from "../merchant-info/merchant-info";
import { BrandPage } from "../brand/brand";
import { ModalBasketPage} from  '../modal-basket-page/modal-basket-page';
import { RewardPage } from  '../reward/reward';

@Component({
  selector: 'page-merchant-details',
  templateUrl: 'merchant-details.html',
})
export class MerchantDetailsPage {
  data_limit :number = 0;
  merchant_id :string = '';
  merchant_data :Array<{}> = [];
  merchant_name : Array<{}> = [];
  collectTime :number= 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  page1: any = MerchantMenuPage;
  page2: any = RewardPage;
  page3: any = MerchantInfoPage;

  showIcons: boolean = true;
  showTitles: boolean = true;
  openingtime : any;
  open_time : string = '';
  DTime :string = '';
  basket_price : any;
  Fixed_price : any;
  item_total_cart : any = 0;
  reward_program : any = '';
  info_temp : string = '';

  stamps_required : any = 0;
  user_progress : any = 0;
  user_can_redeem : boolean = false;
  add_trans_add_left : any =0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider,  public platform : Platform, public modalCtrl: ModalController, public alertCtrl : AlertController) {
    this.merchant_id = this.navParams.get('id');
    this.globalService.merchant_id = this.navParams.get('id');
     const type = navParams.get('type');
     switch (type) {
       case 'icons-only':
         this.showTitles = false;
        // this.pageTitle += ' - Icons only';
         break;

       case 'titles-only':
         this.showIcons = false;
         //this.pageTitle += ' - Titles only';
         break;
     }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad Merchant details screen');
    let data_details_chk = localStorage.getItem('MerchantList');
    if(data_details_chk)
    {
        let data_details = JSON.parse(localStorage.getItem('MerchantList'));
      for(var dt=0;dt< data_details.length;dt++)
      {
        if(this.merchant_id == data_details[dt].id)
        {
          this.dataLoad(data_details[dt]);
        }
      }
    }
    this.resturantList();
    this.platform.ready().then(() => {
            setTimeout(()=>{
              this.add_trans_add_left=1;
            },0)
      });

    this.reward_program = this.globalService.rewards_brand;
    if(this.reward_program)
    {
      this.stamps_required = this.reward_program.stamps_required;
      this.user_progress = this.reward_program.user_progress;
      this.user_can_redeem = this.reward_program.user_can_redeem;
    }
    this.info_temp ='1';
    // cart product check
    var PRODUCT_TOTAL = 0;
    for(let item_show of this.globalService.product_cart)
    {
      for(let price_show of item_show.line_items)
      {
      var price_less = price_show.total_price * price_show.quantity;
      this.basket_price = price_less.toFixed(2);
      this.Fixed_price = price_show.total_price;
       PRODUCT_TOTAL = price_less + PRODUCT_TOTAL;
       this.item_total_cart = PRODUCT_TOTAL.toFixed(2);
       }

    }
    if(this.globalService.temp_page == 'Reward')
    {
      setTimeout(()=>{this.slideToIndex(1);},1000);
    }
    // cart product check
  }
  slideToIndex(index : number) {
    this.superTabs.slideTo(index);
  }

  resturantList(){
    this.apiservice.GetMerchantDetails(this.merchant_id).subscribe((data)=>{
      this.dataLoad(data);
      }, (err) => {

      });
  }
  DistanceTime(walk_id)
  {
    var id = walk_id;
    var lat= this.globalService.latitude;
    if(!lat)
    {
      lat = localStorage.getItem('latitude');
    }
    var long = this.globalService.longitude;
    if(!long)
    {
      long = localStorage.getItem('longitude');
    }
    this.apiservice.walking_times(id,lat,long).subscribe((result)=>{
      var data = result;
      for (var key in data) {
        if(data[key].walking_time)
        {
          this.DTime = data[key].walking_time.duration.text;
        }
      }
    },(err)=>{

    })
  }

dataLoad(data)
{
  this.globalService.merchant_info = data;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d = new Date();
var dayName = days[d.getDay()];
  this.merchant_data = data;
  this.collectTime = Math.floor(data.waiting_time/60);
  this.globalService.collection_TIME = this.collectTime;
  this.globalService.merchant_isopen = data.is_open;
  this.DTime = "-";
  this.DistanceTime(data.id);
  this.openingtime = data.opening_times;
  if(this.openingtime[dayName.toLowerCase()].length > 0)
  {
    let Fday_time = this.openingtime[dayName.toLowerCase()][0];
    let Tday_time = this.openingtime[dayName.toLowerCase()][1];
    if(Fday_time && Tday_time)
    {
      let Ftime_split = Fday_time.split(':');
      let Ftim = Ftime_split[0]+':'+Ftime_split[1];

      let Ttime_split = Tday_time.split(':');
      let Ttim = Ttime_split[0]+':'+Ttime_split[1];
      this.open_time = Ftim+' - '+Ttim;
    }
  }
  this.globalService.menuId = data.menu;
}


  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }

  cartClear()
  {
    if(this.globalService.product_cart.length > 0)
    {
    let alert = this.alertCtrl.create({
        title: 'Warning',
        message: 'Your basket will be cleared, are you sure you want to quit?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'YES',
            handler: () => {
                this.add_trans_add_left=0;
                this.navCtrl.setRoot(BrandPage);
                this.globalService.product_cart = [];
              }
            }
        ]
        });
        alert.present();
      }
      else
      {
        this.add_trans_add_left=0;
        this.navCtrl.pop();
      }
  }

  showModal() {
      this.navCtrl.push(ModalBasketPage,{data : this.globalService.product_cart});
  }

}
