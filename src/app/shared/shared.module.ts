import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateRegisterComponent } from './components/update-register/update-register.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateRegisterComponent
  ],
  exports: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateRegisterComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }
