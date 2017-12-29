import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ProductListOptionPage } from "../product-list-options/product-list-options";
import { ModalBasketPage} from  '../modal-basket-page/modal-basket-page';

@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {
  merchant_data :Array<{}> = [];
  merchant_name : Array<{}> = [];
  category_id : string = '';
  category_name : string = '';
  data_product : any;
  product_data :any;
  product_item : Array<{}>=[];

  basket_price : any;
  Fixed_price : any;
  item_total_cart : any = 0;
  product_found: boolean =false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl: ModalController) {
    this.category_id = this.navParams.get('id');
    this.category_name = this.navParams.get('name');
    this.data_product = this.navParams.get('product_list');
  }
  back_page()
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
    console.log('ionViewDidLoad ProdcutPage');
    if(this.data_product.length > 0)
    {
      this.product_data =this.data_product;
      for(var i=0;i<this.product_data.length;i++)
      {
        if(this.category_id == this.product_data[i].category)
        {
          if(this.product_data[i].is_available == true)
          {
            this.product_item.push(this.product_data[i]);
          }
        }
      }
      if(this.product_item.length == 0)
      {
        this.product_found = false;
      }
      else
      {
        this.product_found = true;
      }
    }
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
    // cart product check
  }

  productListOption(product_info)
  {
    this.navCtrl.push(ProductListOptionPage,{product_list_options :product_info});
  }

  showModal() {
    this.navCtrl.push(ModalBasketPage,{data : this.globalService.product_cart});
  }
}
