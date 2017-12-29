import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ProductListPage } from "../product-list/product-list";

@Component({
  selector: 'page-merchant-menu',
  templateUrl: 'merchant-menu.html',
})
export class MerchantMenuPage {
  menu_name : Array<{}> = [];
  product_name :Array<{}> =[];
  rootNavCtrl: NavController;
  loader_show : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ionViewWillEnter()
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    let menu_list = localStorage.getItem('MenuList');
    if(menu_list)
    {
      let data_get = JSON.parse(menu_list);
      for(var ik=0;ik<data_get.length;ik++)
      {
        if(data_get[ik].id == this.globalService.menuId)
        {
          this.menu_name = data_get[ik].categories;
          this.product_name = data_get[ik].products;
          this.loader_show = true;
        }
      }
    }
    this.getMenuName();
  }

  getMenuName()
  {
    if(this.globalService.menuId == '')
    {
      return false;
    }
    if(this.loader_show == false)
    {
      this.globalService.showLoader();
    }
    this.apiservice.GetMerchantMenuName(this.globalService.menuId).subscribe((data)=>{
      this.menu_name = data.categories;
      this.product_name = data.products;
      if(this.loader_show == false)
      {
        this.globalService.hideLoader();
      }

    },(err)=>{
      if(this.loader_show == false)
      {
        this.globalService.hideLoader();
      }
    });
  }

  menuProduct(cat_id, cat_name)
  {
    this.rootNavCtrl.push(ProductListPage,{id : cat_id, name :cat_name , product_list : this.product_name});
  }



}
