import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ApiServicesProvider } from "../../providers/api-services/api-services";

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
  ],
  providers:[ConstantsProvider,ApiServicesProvider]
})
export class SignUpPageModule {}
