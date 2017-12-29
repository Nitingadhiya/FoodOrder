import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";

@Component({
  selector: 'page-product-list-options',
  templateUrl: 'product-list-options.html',
})
export class ProductListOptionPage {
  data_product : any;
  data_index : any = -1;
  product_data : Array<{}>=[];
  product_check_option : any[]=[];
  add_basket : Array<{}>=[];
  base_price : any = 0;
  item_price : any = 0;
  add_price : any = 0;
  special_request : string = '';
  line_items_array : Array<{}>=[];
  temp_val_array : Array<{}>=[];
  someArray : any[] = [];
  someArray_radio : any[] = [];
  product_update_flag :any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl: ModalController, public alertCtrl : AlertController) {
    this.data_product = this.navParams.get('product_list_options');
    this.data_index = this.navParams.get('index');
    if(this.data_index >= 0)
    {

    }else{
      this.data_index =-1;
    }
      console.log(this.data_index);
  }
  back_page()
  {
    if(this.data_index >= 0 && this.product_update_flag == true)
    {
      this.quotes_api();
    }
    this.navCtrl.pop();
  }

onInputTime(value)
{
  if(this.data_index >= 0)
  {
    this.product_update_flag = true;
    this.globalService.product_cart[this.data_index].line_items[0].special_request = this.special_request;
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
      console.log('ionViewDidLoad Product option page');
    var data_price_fixed = parseFloat(this.data_product.price);
      this.base_price = data_price_fixed.toFixed(2);
      this.item_price = data_price_fixed.toFixed(2);

      for (var key in this.data_product.variations)
      {
        if(this.data_product.variations[key].type == 'multichoice')
        {
          this.product_data.push({'key_name':key,'label':this.data_product.variations[key].label,'type':this.data_product.variations[key].type,'value':this.data_product.variations[key].options});
        }
        else if(this.data_product.variations[key].type == 'choice')
        {
          this.product_data.push({'key_name':key,'label':this.data_product.variations[key].label,'type':this.data_product.variations[key].type,'value':this.data_product.variations[key].options});
        }
        else if(this.data_product.variations[key].type == 'boolean')
        {
          this.product_data.push({'key_name':key,'label':this.data_product.variations[key].label,'type':this.data_product.variations[key].type,'price_modifier':this.data_product.variations[key].price_modifier,'default':this.data_product.variations[key].default});
        }
      }

    if(this.data_index >= 0)
    {
      this.edit_cart_item();
    }
  }

  edit_cart_item()
  {
    this.special_request = this.globalService.product_cart[this.data_index].line_items[0].special_request;
      let variations_items = this.globalService.product_cart[this.data_index].line_items[0].variations;
      if(this.globalService.product_cart[this.data_index].line_items[0].product == this.data_product.id)
      {
      if(variations_items)
      {
        for(var jp=0;jp<variations_items.length;jp++)
        {
          this.product_check_option = variations_items;
            if(variations_items[jp].type == 'multichoice')
            {
              this.someArray.push(variations_items[jp].value);
              if(variations_items[jp].price_operator == 'add')
              {
                this.item_price = parseFloat(this.item_price) + parseFloat(variations_items[jp].price_modifier);
              }
              else
              {
                this.item_price = parseFloat(this.item_price) - parseFloat(variations_items[jp].price_modifier);
              }
            }

            if(variations_items[jp].type == 'choice' || variations_items[jp].type == 'boolean')
            {
              this.someArray_radio.push(variations_items[jp].value);
              this.temp_val_array.push(variations_items[jp].key_name);
              if(variations_items[jp].price_operator == 'add')
              {
                this.item_price = parseFloat(this.item_price) + parseFloat(variations_items[jp].price_modifier);
              }
              else
              {
                this.item_price = parseFloat(this.item_price) - parseFloat(variations_items[jp].price_modifier);
              }
            }
        }
      }
      this.item_price = this.globalService.product_cart[this.data_index].line_items[0].total_price;
    }
    //}
  }
    onChange(keyName, type, choice, i , event)
    {
      console.log(event);
      this.product_update_flag = true;
      if(event == false)
      {
        for(var jk=0;jk<this.product_check_option.length;jk++)
        {
          if(this.product_check_option[jk].value == choice.value)
          {
            //In Array
            this.product_check_option.splice(jk, 1);
            //var index = this.product_check_option.indexOf(choice.value);
          }
        }

      }
      else
      {
        this.product_check_option.push({'key_name':keyName,'value':choice.value,'price_modifier':choice.price_modifier,'label':choice.label,'price_operator':choice.price_operator,'checked':choice.checked,'type':type});
        console.log(this.data_index+"index");
      }

      this.add_price =0;

      if(this.product_check_option.length > 0)
      {
        for(var x=0;x<this.product_check_option.length;x++)
        {
          this.add_price = parseFloat(this.product_check_option[x].price_modifier) + parseFloat(this.add_price);
        }
      }

      var check_fixed_price = parseFloat(this.base_price) + parseFloat(this.add_price);
      this.item_price =  check_fixed_price.toFixed(2);
      //console.log(JSON.stringify(this.product_check_option)+"*****************Checkbox");

      if(this.data_index >= 0)
      {
        //let variations_items = this.globalService.product_cart[this.data_index].line_items[0].variations;
        if(this.globalService.product_cart[this.data_index].line_items[0].product == this.data_product.id)
        {
          this.globalService.product_cart[this.data_index].line_items[0].variations = this.product_check_option;
          this.globalService.product_cart[this.data_index].line_items[0].total_price = this.item_price;
        }
      }
      //console.log(JSON.stringify(this.globalService.product_cart));
    }

    on_radioChange(keyName, type, choice, i , value)
    {
      this.product_update_flag = true;
      var label_UDF ='';
      var price_additon :any= 0;
        if(!choice.value)
        {

          label_UDF = choice.label;
        }
        else
        {
          label_UDF = choice.value;
        }
        console.log(label_UDF+"***");

      for(var jk=0;jk<this.product_check_option.length;jk++)
      {

          if(this.temp_val_array.indexOf(keyName) > -1)
          {
            if(this.product_check_option[jk].key_name == keyName)
            {
              this.product_check_option[jk].value = label_UDF;
              this.product_check_option[jk].price_modifier = choice.price_modifier;
              this.product_check_option[jk].label = choice.label;
            }
            //In the array!
          }
          else
          {
            if(this.product_check_option[jk].key_name == keyName && this.product_check_option[jk].value == choice.value)
            {
              this.product_check_option.splice(jk,1);
            }
            this.temp_val_array.push(keyName);
            this.product_check_option.push({'key_name':keyName,'value':label_UDF,'price_modifier':choice.price_modifier,'label':choice.label,'price_operator':choice.price_operator,'checked':choice.checked,'type':type});

                //Not in the array!
          }
          price_additon = parseFloat(price_additon.toFixed(2)) + parseFloat(this.product_check_option[jk].price_modifier);
      }

      if(this.product_check_option.length == 0)
      {
        this.product_check_option.push({'key_name':keyName,'value':label_UDF,'price_modifier':choice.price_modifier,'label':choice.label,'price_operator':choice.price_operator,'checked':choice.checked,'type':type});
        this.temp_val_array.push(keyName);
        price_additon = parseFloat(price_additon.toFixed(2)) + parseFloat(this.product_check_option[0].price_modifier);
      }

      var check_fixed_price = parseFloat(this.base_price) + parseFloat(price_additon.toFixed(2));
      this.item_price =  check_fixed_price.toFixed(2);

      if(this.data_index >= 0)
      {
        if(this.globalService.product_cart[this.data_index].line_items[0].product == this.data_product.id)
        {
          this.globalService.product_cart[this.data_index].line_items[0].variations = this.product_check_option;
          this.globalService.product_cart[this.data_index].line_items[0].total_price = this.item_price;
        }
      }
      //console.log(JSON.stringify(this.globalService.product_cart));
    }

    add_to_basket()
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
      this.line_items_array.push({'product_name':this.data_product.name,'quantity':1,'special_request':this.special_request,'product':this.data_product.id,'variations':this.product_check_option,'total_price':this.item_price});

      this.add_basket.push({'merchant':this.globalService.merchant_id,'line_items':this.line_items_array,'collection_time':'','user':this.globalService.user_id});

      this.globalService.product_cart = this.add_basket;
      this.quotes_api();
    }

    quotes_api()
    {
        console.log(JSON.stringify(this.globalService.product_cart));

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
              obj={};
              for(var jk =0;jk<variation.length;jk++)
              {
                  //console.log(variation[jk].key_name+"name"+variation[jk].value);
                  if(variation[jk].type == 'multichoice')
                  {
                    var trs = '';
                    for(var val in obj)
                    {
                      trs =val;
                    }
                    console.log(obj[variation[jk].key_name]+"Name");
                    if(trs == variation[jk].key_name)
                    {
                      multichoice_val.push(variation[jk].value);
                      //console.log("mul if"+multichoice_val);
                    }
                    else
                    {
                      multichoice_val=[];
                      multichoice_val.push(variation[jk].value);
                      //console.log("mul else"+multichoice_val);
                    }

                    obj[variation[jk].key_name] = multichoice_val; //multichoice_val;
                    //console.log(obj);
                    //console.log(variation[jk].key_name+"key_name");

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
        console.log(JSON.stringify(quotes_array));
        var data ={};
        if(product_reward == '')
        {
          data ={
            //"promotions":"",
            "line_items": quotes_array,
            "merchant": this.globalService.product_cart[0].merchant,
          }

        }
        else
        {
          data ={
              "reward": product_reward,
              //"promotions":"",
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
          this.globalService.cart_total = data_total.total;
        }
        if(this.data_index >= 0)
        {

        }else
        {
          this.navCtrl.pop();
        }
      },(err) => {
        console.log("Failed");
        console.log(this.globalService.product_cart.length);
        var product_cart_failed  = this.globalService.product_cart.length - 1;
          this.globalService.product_cart.splice(product_cart_failed, 1);
          this.globalService.hideLoader();
      });
    }


}
