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
import { ViewInventoryComponent } from './components/view-inventory/view-inventory.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { ViewRegisterComponent } from './components/view-register/view-register.component';
import { ViewToolsComponent } from './components/view-tools/view-tools.component';
import { ViewCostsComponent } from './components/view-costs/view-costs.component';
import { UpdateFinanceComponent } from './components/update-finance/update-finance.component';
import { UpdateProvidersComponent } from './components/update-providers/update-providers.component';
import { ViewProvidersComponent } from './components/view-providers/view-providers.component';
import { UpdateAccountsComponent } from './components/update-accounts/update-accounts.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateRegisterComponent,
    UpdateInventoryComponent,
    UpdateToolsComponent,
    UpdateCostsComponent,
    UpdateFinanceComponent,
    UpdateProvidersComponent,
    UpdateAccountsComponent,

    ViewEmployeeComponent,
    ViewRegisterComponent,
    ViewInventoryComponent,
    ViewToolsComponent,
    ViewCostsComponent,
    ViewProvidersComponent
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
    UpdateFinanceComponent,
    UpdateProvidersComponent,
    UpdateAccountsComponent,

    ViewEmployeeComponent,
    ViewRegisterComponent,
    ViewInventoryComponent,
    ViewToolsComponent,
    ViewCostsComponent,
    ViewProvidersComponent,

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
