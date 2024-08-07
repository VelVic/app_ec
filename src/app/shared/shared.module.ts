import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateRegisterComponent } from './components/update-register/update-register.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { UpdateToolsComponent } from './components/update-tools/update-tools.component';
import { UpdateCostsComponent } from './components/update-costs/update-costs.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateRegisterComponent,
    UpdateInventoryComponent,
    UpdateToolsComponent,
    UpdateCostsComponent
  ],
  exports: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateRegisterComponent,
    UpdateInventoryComponent,
    UpdateToolsComponent,
    UpdateCostsComponent,
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
