import { Component } from '@angular/core';
import { ViewController,LoadingController, NavParams, NavController, AlertController,ModalController} from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
//import { ConstantsProvider } from "../../providers/constants/constants";
import { ModalRedeemNow } from "../modal-redeem-now/redeem-now";


@Component({
    selector: 'modal-redeem-in-store',
    templateUrl: 'store.html'
})
export class ModalRedeemInStore{
  item_data : any = '';

  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController , public navParams :  NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public navCtrl: NavController, public alertCtrl : AlertController, public modalCtrl: ModalController) {
    this.item_data = this.navParams.get('data');
  }

  closePage()
  {
    this.viewCtrl.dismiss();
  }

  RedeeemNow(data)
  {
    this.closePage();
    this.showModal(data);
  }

  showModal(item_data) {
      let modal = this.modalCtrl.create(ModalRedeemNow,{data:item_data});
      modal.onDidDismiss(data => {
      })
      modal.present();
  }

}
