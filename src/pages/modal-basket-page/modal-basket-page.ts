import { Component } from '@angular/core';
import { ViewController,LoadingController, NavParams, NavController, AlertController,ModalController} from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { MerchantDetailsPage } from "../merchant-details/merchant-details";
import { StripePage} from  '../stripe-page/stripe';
import { DefaultPage} from  '../default/default';
import { BrandPage} from  '../brand/brand';
import { ProductListOptionPage } from "../product-list-options/product-list-options";

@Component({
    selector: 'modal-basket-page',
    templateUrl: 'modal-basket-page.html',
})
export class ModalBasketPage{

merchant_data :Array<{}> = [];
merchant_name : Array<{}> = [];
merchant_address : string = '';
basket_data : any[] = [];
basket_price : any;
Fixed_price : any;
item_total_cart : any;
productOPT :any[] =[];
line_ITEMS :any[] =[];
Line_value :any[] =[];
variation_value :any[] =[];
temp_array_key : Array<{}> = [];
variation_keyArray :Array<{}> = [];
myDate : any;
date_time_display : any ='';

data_merchant_id : number = 0;
data_qutoes_line :any;
data_total : any = 0;
data_stamp : any = 0;
slot_data_time : any[] = [];
time_display : string ='';
collection_time : string = '';
cart_promotions : any ='';
timeCOL : any;

 dependentColumns:any[] =[];
    constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController , public navParams :  NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public navCtrl: NavController, public alertCtrl : AlertController,public modalCtrl: ModalController,public constants: ConstantsProvider) {
        this.basket_data = this.navParams.get('data');
    }

    ionViewWillEnter()
    {
      this.globalService.menuShow = false;
      setTimeout(()=>{
        this.globalService.headerShow = false;
      },this.globalService.navigationTime);
    }
    ionViewDidLoad() {
      this.resturantList();
      this.getUserApi();
      var PRODUCT_TOTAL = 0;
      this.merchant_address = this.globalService.merchant_info.address;
      for(let item_show of this.basket_data)
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
      this.quotesApi();
      this.slotTime();
    }
    give_value(def)
    {
      this.time_display= '1';
      this.collection_time = def;
       clearInterval(this.timeCOL);
    }

    slotTime()
    {
        var str_chk ='';
      this.apiservice.Getslot_time(this.globalService.merchant_id).subscribe((data)=>{
          let data_slot = data;
          this.slot_data_time=[];
          data_slot.forEach((timeDate, index) => {
            var spl = timeDate.time;
            var dt_split = spl.split('T');
            var time_split = dt_split[1].split(':');
            var time_hour = time_split[0];
            var time_minute = time_split[1];
            var combine = time_hour+":"+time_minute;
            var check_min = parseFloat(time_minute)+5;
              str_chk = check_min+"";
            if(check_min < 10)
            {
              str_chk = "0"+check_min;
            }

            //var add_combine = time_hour+":"+str_chk;
            if(timeDate.available == true)
            {
              if(index == 0)
              {
                  this.slot_data_time.push({text:'(ASAP) 5 Minutes',value:'5min'});
                  this.slot_data_time.push({text:combine,value:spl});
              }else
              {
                this.slot_data_time.push({text:combine,value:spl});
              }
            }
          });
            this.dependentColumns = [{options: this.slot_data_time}];
      },
      (err)=>{

      });
    }

    closePage()
    {
      clearInterval(this.timeCOL);
      this.navCtrl.pop();
    }
    resturantList(){
      //  this.globalService.loading.setContent('Get Merchant Details..');
      this.apiservice.GetMerchantDetails(this.globalService.merchant_id).subscribe((data)=>{
          this.merchant_data = data;
          this.globalService.merchant_isopen = data.is_open;
          this.globalService.menuId = data.menu;
        }, (err) => {
          //this.globalService.hideLoader();
        });
    }

    quantityAdd(number, item_id,product_index)
    {
      var PRODUCT_TOTAL = 0;
      var add = number + 1;
      var point_val = parseFloat(this.Fixed_price) * add;
      this.basket_price = point_val.toFixed(2);
      var cart_details = this.globalService.product_cart;
      for(var j=0;j<cart_details.length;j++)
      {
        var product_add = cart_details[j].line_items;
        for(var i=0;i<product_add.length;i++)
        {
          if(product_add[i].product == item_id && j == product_index)
          {
              product_add[i].quantity = add;
          }
          var price_less = product_add[i].total_price * product_add[i].quantity;
          PRODUCT_TOTAL = price_less + PRODUCT_TOTAL;
          this.item_total_cart = PRODUCT_TOTAL.toFixed(2);
        }
      }
      this.quotesApi();
    }

    quantityMinus(number, item_id, product_index)
    {
    var PRODUCT_TOTAL = 0;
      if(number == 1)
      {

        let alert = this.alertCtrl.create({
        title: 'Warning',
        message: 'Do you want to remove this product?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Remove',
            handler: () => {
              //var PRODUCT_TOTAL = 0;
              this.globalService.product_cart.splice(product_index, 1);
              var cart_details = this.globalService.product_cart;
              for(var j=0;j<cart_details.length;j++)
              {
                var product_add = cart_details[j].line_items;
                for(var i=0;i<product_add.length;i++)
                {
                  var price_less = product_add[i].total_price * product_add[i].quantity;
                  PRODUCT_TOTAL = price_less + PRODUCT_TOTAL;
                  this.item_total_cart = PRODUCT_TOTAL.toFixed(2);
                }
              }
              this.quotesApi();
              if(this.globalService.product_cart.length < 1)
              {
                this.viewCtrl.dismiss();
              }
            }
          }
        ]
      });
        alert.present();
      }
      else
      {
          //var PRODUCT_TOTAL = 0;
          var add = number - 1;
          var point_val = parseFloat(this.Fixed_price) * add;
          this.basket_price = point_val.toFixed(2);
          var cart_details = this.globalService.product_cart;
          for(var j=0;j<cart_details.length;j++)
          {
            var product_add = cart_details[j].line_items;
            for(var i=0;i<product_add.length;i++)
            {
              if(product_add[i].product == item_id && j == product_index)
              {
                  product_add[i].quantity = add;
              }
              var price_less = product_add[i].total_price * product_add[i].quantity;
              PRODUCT_TOTAL = price_less + PRODUCT_TOTAL;
              this.item_total_cart = PRODUCT_TOTAL.toFixed(2);
            }
          }
          this.quotesApi();
      }
    }

  cancelOrder()
  {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Your basket will be cleared, are you sure you want to quit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.globalService.product_cart=[];
            this.navCtrl.setRoot(BrandPage);
            //this.close_page();
          }
        }]
      });
        alert.present();
  }
    merchantDetails_screen()
    {
      //,rootNavCtrl:this.rootNavCtrl
      this.navCtrl.push(MerchantDetailsPage,{id: this.globalService.merchant_id});
    }

    productListOptionPage(product_id,index)
    {
      this.globalService.showLoader();
        this.apiservice.GetProductOption(product_id).subscribe((data)=>{

          if(data.details)
          {
            //this.globalService.showModal();
          }
          this.globalService.hideLoader();
          //this.viewCtrl.dismiss(this.productOPT);
          this.productOPT = data;
          this.navCtrl.push(ProductListOptionPage,{product_list_options :data,'index':index});
          },(err) => {
            this.globalService.hideLoader();
        });
    }

    defaultShowModal() {
        let modal = this.modalCtrl.create(DefaultPage);
        modal.onDidDismiss(data => {

        })
        modal.present();
    }
    continueOrder()
    {
      if(!this.collection_time)
      {
        this.collection_time="5min";
        //this.globalService.presentToast('Please Enter collection time')
        //return false;
      }

      if(this.globalService.access_token == '')
      {
        const alert = this.alertCtrl.create({
          title: 'Foodorder',
          message: 'To continue, please sign up to Foodorder',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Sign Up',
              handler: () => {
                  this.defaultShowModal();
              }
            }
          ]
        });
        alert.present();

        return false;
      }

      if(this.collection_time == "5min")
      {
        this.collection_time=null;
      }
          this.globalService.payment_order_item = {"merchant":this.data_merchant_id,"line_items":this.data_qutoes_line,'total':this.data_total,'stamp':this.data_stamp,'collection_time':this.collection_time,'user':this.globalService.user_id};
          setTimeout(()=>{
            this.navCtrl.push(StripePage,{order_data: this.globalService.payment_order_item});
          },500);
    }

    getUserApi()
    {
      this.apiservice.get_user_id().subscribe((data)=>{
        var data_response = data;
        this.globalService.user_id = data_response.id;
        this.globalService.card_info = data_response.card;

      },(err)=>{

      });
    }
    quotesApi()
    {
        var obj={};
        var variation =[];
        var quotes_array=[];
        var product_reward='';
        for(var ng=0;ng<this.globalService.product_cart.length;ng++)
        {
          product_reward = this.globalService.product_cart[ng].reward_product;
          variation = this.globalService.product_cart[ng].line_items[0].variations;
            if(variation)
            {
              var multichoice_val=[];
              obj={};
              for(var jk =0;jk<variation.length;jk++)
              {
                  if(variation[jk].type == 'multichoice')
                  {
                    var trs = '';
                    for(var val in obj)
                    {
                      trs =val;
                    }

                    if(trs == variation[jk].key_name)
                    {
                      multichoice_val.push(variation[jk].value);
                    }
                    else
                    {
                      multichoice_val=[];
                      multichoice_val.push(variation[jk].value);
                    }

                    obj[variation[jk].key_name] = multichoice_val; //multichoice_val;
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
        if(data_total.total)
        {
          this.data_merchant_id = data_total.merchant;
          this.data_qutoes_line = data_total.line_items;
          this.data_total = data_total.total;
          this.data_stamp = data_total.stamps_granted;
          this.globalService.cart_total = data_total.total;
          let promotional = data.promotions;
          if(promotional.length > 0)
          {
            this.cart_promotions = promotional[0].name;
          }
        }
      },(err) => {
          this.globalService.hideLoader();
      });
    }

openPicker()
{
  this.timeCOL = setInterval(()=>{
    this.slotTime();
  },60000);
}
basketItemEdit()
{
  this.navCtrl.push(ProductListOptionPage);
}

ionViewWillLeave()
{
  clearInterval(this.timeCOL);
  this.globalService.menuShow = false;
  this.globalService.headerShow = true;
}

}
