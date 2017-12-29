import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { FavouritesDetailsPage} from  '../favourites-details/favourites-details';


@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {

  data_offset :number =0;
  load_more = false;
  favourites : any[] = [];
  favourites_local : any[] = [];
  data_favourites : any[] = [];
  rootNavCtrl: NavController;
  data_not_found : string='';
  data_Favourites_url : String ='';
  fav_list_blank :boolean =false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }
  ionViewDidEnter()
  {
    this.fav_list_blank = true;
    if(this.globalService.recipe_page == true)
    {
      this.load_more=true;
    }
    let FV_data = localStorage.getItem('FavouriteList');
    if(FV_data)
    {
      this.globalService.favourites_local = JSON.parse(FV_data);
      this.load_more =true;
    }
    this.globalService.data_limit=0;
    this.getFavourite(this.globalService.data_limit, this.data_offset,'');
  }
  ionViewDidLoad() {
    /*if(this.globalService.recipe_page == true)
    {
      this.load_more=true;
    }
    let FV_data = localStorage.getItem('FavouriteList');
    if(FV_data)
    {
      this.globalService.favourites_local = JSON.parse(FV_data);
      this.load_more =true;
    }
    this.globalService.data_limit=0;
    this.getFavourite(this.globalService.data_limit, this.data_offset,'');*/
  }
  /* Favourite slide code*/

  getFavourite(limit, offset, data_Favourites_url)
  {
    this.apiservice.Get_Favourite(limit, offset, data_Favourites_url).subscribe((data)=>{
      this.data_favourites = data.results;
      this.data_Favourites_url = data.next;

      if(this.data_favourites.length == 0)
      {
        this.data_not_found='No Items found';
      }
      if(this.fav_list_blank == true)
      {
        this.favourites=[];
        this.fav_list_blank = false;
      }
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
        this.favourites.push({'id':this.data_favourites[i].id,'merchant_name':temp_merchant,'merchant':this.data_favourites[i].merchant,'total':this.data_favourites[i].total,'order_date':this.data_favourites[i].order_date})
      }
      localStorage.setItem('FavouriteList',JSON.stringify(this.favourites));
      this.globalService.favourites_local = this.favourites;
    },(err) => {

    });
  }

  favouritesDetails(id)
  {
    this.rootNavCtrl.push(FavouritesDetailsPage,{'id':id});
  }

  doInfinite(infiniteScroll)
  {
     console.log('Begin async operation');
     this.load_more =true;
      this.data_offset+=10;
    if(this.data_Favourites_url == null)
    {
      infiniteScroll.complete();
      return false;
    }
    this.getFavourite(this.globalService.data_limit, this.data_offset, this.data_Favourites_url);
    setTimeout(() => {
     console.log('Async operation has ended');
     infiniteScroll.complete();
    }, 1500);
  }
  /* Favourite slide code*/

}
