import { Component , OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ModalThankYouPage} from  '../modal-thank-you/thank-you';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage implements OnInit {
elements: Elements;
 card: StripeElement;
 @ViewChild('card') cardRef: ElementRef;

 // optional parameters
 elementsOptions: ElementsOptions = {
   locale: 'en'
 };

 private cardToken:any;
 merchant_name = '';
 merchant_address='';
 order_DATA:any='';
 card_details_add : number =0;
 cardNumber : any;
 cvc : any;
 expiry_month : any;
 expiry_year : any;
 card_status : any = '';
 card_type : string ='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl: ModalController,private toastCtrl: ToastController,private stripeService: StripeService,private keyboard: Keyboard) {
    this.order_DATA = this.navParams.get("order_data");
    this.keyboard.onKeyboardShow().subscribe(data=>{
      console.log("keyboard evnt");
    })
    this.keyboard.onKeyboardHide()
     .subscribe(data => {
        console.log('keyboard is Hide');
        this.globalService.keyboard_height = 0;
     });
  }
  ionViewWillLeave()
  {
    this.keyboard.close();
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
     this.get_user_api();
     if(this.globalService.merchant_info)
     {
       this.merchant_name = this.globalService.merchant_info.name;
       this.merchant_address= this.globalService.merchant_info.address;
     }
   }
   keyboard_close()
   {
     this.keyboard.close();
   }
   ngOnInit() {
     this.stripeService.elements(this.elementsOptions)
       .subscribe(elements => {
         this.elements = elements;

         if (!this.card) {
           this.card = this.elements.create('card',{
             style: {
               base: {
                 iconColor: '#666EE8',
                 color: '#31325F',
                 lineHeight: '40px',
                 fontWeight: 300,
                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                 fontSize: '18px',
                 '::placeholder': {
                   color: '#CFD7E0'
                 }
               }
             },
             'hidePostalCode' : true
           });
           this.card.mount(this.cardRef.nativeElement);
         }
       });
   }
   buy() {
     this.globalService.showLoader();
     this.stripeService
       .createToken(this.card,{'name':''})
       .subscribe(result => {
         if(result.error)
         {
          this.globalService.hideLoader();
           this.presentToast(result.error.message);
         }
         var result_data = result.token;
         if(result_data)
         {
           this.cardToken = result_data.id;
           this.set_card_number();
         }
       },(err)=>{
          this.globalService.hideLoader();
       });
   }

   set_card_number()
   {
     if(this.cardToken == '')
     {
       this.globalService.presentToast('Please enter valid Card.')
       return false;
     }
     var data ={
       'card':this.cardToken
     }
     this.apiservice.SetCardName(data).subscribe((response)=>{
      this.globalService.hideLoader();
      this.globalService.card_info = response;
      this.navCtrl.pop();
      this.presentToast('New Payment Card Added Successfully.');

     },(err) => {
       this.globalService.hideLoader();
     });
   }

   get_user_api()
   {
     this.apiservice.get_user_id().subscribe((data)=>{
       var data_response = data;
       this.globalService.user_id = data_response.id;
       this.globalService.card_info = data_response.card;
     },(err)=>{

     });
   }

   delete_card_Details()
   {
     this.globalService.showLoader();
     var data ={
       'method':'card'
     }
     this.apiservice.DeleteCardName(data).subscribe((data)=>{
       this.globalService.presentToast('Card deleted Successfully.');
       this.globalService.card_info='';
       this.globalService.hideLoader();
       this.navCtrl.pop();

     },(err) => {
       this.globalService.hideLoader();
     });
   }
   payment()
   {
     if(!this.order_DATA)
     {
       console.log("Something went to wrong");
       return false;
     }
       this.globalService.showLoader();
       //this.globalService.loading.setContent('Paying for a order');
     this.apiservice.product_Order(this.order_DATA).subscribe((data)=>{

       this.globalService.hideLoader();
         this.globalService.product_cart = [];
         setTimeout(()=>{
           this.navCtrl.push(ModalThankYouPage,{order_data: data});
         },500);
     },(err)=>{
         this.globalService.hideLoader();
         this.globalService.presentToast("Cannot charge a customer that has no active card");
     });
   }

   back_page()
   {
     this.navCtrl.pop();
   }
   add_card_Details()
   {
     this.card_details_add = 1;
   }
   presentToast(msg) {
     let toast = this.toastCtrl.create({
       message: msg,
       duration: 5000,
       position: 'bottom',
       dismissOnPageChange: true,
       closeButtonText:'Close',
       showCloseButton:true
     });

     toast.onDidDismiss(() => {
       console.log('Dismissed toast');
     });

     toast.present();
   }
}
