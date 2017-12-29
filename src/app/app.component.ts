import { Component, ViewChild } from '@angular/core';
import { Nav, Platform ,ModalController,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrandPage} from  '../pages/brand/brand';
import { MyBeliPage} from  '../pages/my-beli/my-beli';
import { HomePage} from  '../pages/home/home';
import { PromoCodePage} from  '../pages/promocode-page/promocode';
import { GlobalVarService } from '../providers/constants/global-var';
import { ConstantsProvider } from "../providers/constants/constants";
import { DefaultPage } from "../pages/default/default";
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = BrandPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public globalService : GlobalVarService,  public modalCtrl: ModalController,public constants: ConstantsProvider,public alertCtrl: AlertController,private keyboard: Keyboard) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
        //this.initPushNotification();
    if (this.platform.is('ios')) {
      this.keyboard.onKeyboardShow()
        .subscribe(data => {
           console.log('keyboard is shown');
           this.globalService.keyboard_height = data.keyboardHeight;
        });
        this.keyboard.onKeyboardHide()
         .subscribe(data => {
            console.log('keyboard is Hide');
            this.globalService.keyboard_height = 0;
         });
       }
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  brandPage()
  {
    this.nav.setRoot(BrandPage);
  }

  mybeliPage()
  {
    if(!this.globalService.access_token)
    {
      this.showModal();
    }
    else
    {
      this.nav.setRoot(MyBeliPage);
    }
  }
  favouritesPage()
  {
    localStorage.setItem('supertab_selected','1');
    this.nav.setRoot(HomePage);
  }

  receiptsPage()
  {
    localStorage.setItem('supertab_selected','2');
    this.nav.setRoot(HomePage);
  }

  promoCodePage()
  {
    if(!this.globalService.access_token)
    {
      this.showModal();
    }
    else
    {
      this.nav.setRoot(PromoCodePage);
    }
  }

  signIn()
  {
    localStorage.clear();
    this.globalService.access_token='';
    this.globalService.token_type='';
    this.globalService.profile_name='';
    this.globalService.avatar_url='';
    localStorage.setItem('walk_screen','2');
    this.showModal();
  }

  signOut()
  {
    localStorage.clear();
    this.globalService.access_token='';
    this.globalService.token_type='';
    this.globalService.profile_name='';
    this.globalService.avatar_url='';
    localStorage.setItem('walk_screen','2');
  }

  showModal() {
    let modal = this.modalCtrl.create(DefaultPage);
    modal.onDidDismiss(data => {  })
    modal.present();
  }
}
