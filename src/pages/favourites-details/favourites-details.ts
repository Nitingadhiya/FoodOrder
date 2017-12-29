import {Component} from '@angular/core';

import {NavController, ModalController, NavParams} from 'ionic-angular';

import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";

import { MerchantDetailsPage } from "../merchant-details/merchant-details";
import { ModalBasketPage} from  '../modal-basket-page/modal-basket-page';
import { HomePage} from  '../home/home';

@Component({
  selector: 'page-favourites-details',
  templateUrl: 'favourites-details.html'
})
export class FavouritesDetailsPage {

  favourites_id : number = 0;
  data_favourites_Details : any[] =[];
  data_user :any[] = [];
  merchant_address :String = '';
  merchant_name :String ='';
  varation_temp :any []= [];
  variation_string : Array<{}>=[];
  data_favourites : any[] = [];

  merchant_data :any ='';
  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public constants: ConstantsProvider, public modalCtrl: ModalController, public navParams : NavParams, public apiservice: ApiServicesProvider) {
    this.favourites_id = this.navParams.get('id');
  }

  backPage()
  {
    this.navCtrl.pop(HomePage);
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
    console.log('ionViewDidLoad ReceiptsDetailsPage');
    this.favouritesDetails();
  }

  favouritesDetails()
  {
    this.globalService.showLoader();
    this.apiservice.Get_Favourite_details(this.favourites_id).subscribe((data)=>{
      this.data_favourites_Details = data;
      this.merchant_data = this.data_favourites_Details;
      for(let merchant_list of this.globalService.MerchantList)
      {
        if(this.merchant_data.merchant == merchant_list.id)
        {
          this.merchant_name = merchant_list.name;
          this.merchant_address = merchant_list.address;
          this.globalService.merchant_info = merchant_list;
        }
      }
        this.globalService.hideLoader();
    },(err) => {
        //this.globalService.presentToast('Get Favourites Details Error.');
        this.globalService.hideLoader();
    });
  }
  merchantDetailsPage(merchant_id)
  {
    this.navCtrl.push(MerchantDetailsPage,{id: merchant_id})
  }
  removeFavourite(id)
  {
    this.globalService.showLoader();
    this.apiservice.remove_Favourite(id).subscribe((data)=>{
    this.globalService.hideLoader();
      this.getFavourite(this.globalService.data_limit,0,'');
        setTimeout(()=>{
          this.navCtrl.pop();
        },1000);
    },(err) => {
        this.globalService.hideLoader();
    });
  }

  getFavourite(limit, offset, data_Favourites_url)
  {
    this.globalService.favourites_local=[];
    this.apiservice.Get_Favourite(limit, offset, data_Favourites_url).subscribe((data)=>{
      this.data_favourites = data.results;
      for(var i=0;i<this.data_favourites.length;i++)
      {
        var temp_merchant = '';
        for(let merchant_list of this.globalService.MerchantList)
        {
          if(this.data_favourites[i].merchant == merchant_list.id)
          {
            temp_merchant = merchant_list.name;
          }
        }
        this.globalService.favourites_local.push({'id':this.data_favourites[i].id,'merchant_name':temp_merchant,'merchant':this.data_favourites[i].merchant,'total':this.data_favourites[i].total,'order_date':this.data_favourites[i].order_date})
      }
      localStorage.setItem('FavouriteList',JSON.stringify(this.globalService.favourites_local));
    },(err) => {

    });
  }
  reorder(data)
  {
    var data_array = [];
    var merchant_id = data.merchant;
    var data_fav = data.favourite_items;
    var line_item_array = [];
    var variations_data =[];
    var variation_string='';
    var variation_data_string;
    var type='';
    for(var i=0;i<data_fav.length;i++)
    {
        var jk=0;
        for (var key in data_fav[i].variations) {

          variation_string = data_fav[i].variation_string;
          variation_data_string = variation_string.split(',');

          if(data_fav[i].variations.type == true)
          {
            type = 'boolean';
          }
          else
          {

          }
            variations_data.push({'key_name':key,'price_modifier':'','label':variation_data_string[jk],'type':type});
            jk++;
        }
      line_item_array.push({'product_name':data_fav[i].name,'quantity':data_fav[i].quantity,'special_request':data_fav[i].special_request,'product':data_fav[i].product,'variations':variations_data,'total_price':data_fav[i].total});
    }

    data_array = [{'merchant':merchant_id,"line_items":line_item_array,"collection_time":'',"user":data.user}];
    this.globalService.product_cart = data_array;
    this.globalService.merchant_id = merchant_id;
    this.showModal(data_array);
  }

  showModal(basket_data) {
    this.navCtrl.push(ModalBasketPage,{data : this.globalService.product_cart});
  }
}
