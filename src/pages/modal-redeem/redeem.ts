import { Component } from '@angular/core';
import { ViewController,LoadingController, NavParams,NavController, AlertController, ModalController} from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { HomePage } from "../home/home";
import { ModalRedeemInStore } from "../modal-redeem-in-store/store";


@Component({
    selector: 'modal-redeem',
    templateUrl: 'redeem.html'
})
export class ModalRedeemPage{
  item_data : any = '';
  stamps_required : any = '';
  user_progress : any = '';

    constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController , public navParams :  NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public navCtrl: NavController, public alertCtrl : AlertController, public modalCtrl: ModalController, public constants: ConstantsProvider) {
      this.item_data = this.navParams.get('data');
      console.log(this.item_data);
    }

    closePage()
    {
      this.viewCtrl.dismiss();
    }
    addBasket()
    {
      this.globalService.temp_page="Reward";
      this.viewCtrl.dismiss();
      this.navCtrl.push(HomePage);
    }
    redeemInStore()
    {
      this.viewCtrl.dismiss();
      this.showModal(this.item_data);
    }

    showModal(item_data) {
      console.log(item_data)
        let modal = this.modalCtrl.create(ModalRedeemInStore,{data:item_data});
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){

            }
        })
        modal.present();
    }

}
