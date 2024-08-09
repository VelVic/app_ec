import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'registers',
        loadChildren: () => import('./registers/registers.module').then( m => m.RegistersPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then( m => m.InventoryPageModule)
      },
      {
        path: 'costs',
        loadChildren: () => import('./costs/costs.module').then( m => m.CostsPageModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then( m => m.FinancePageModule)
      },
      {
        path: 'providers',
        loadChildren: () => import('./providers/providers.module').then( m => m.ProvidersPageModule)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.module').then( m => m.AccountsPageModule)
      },
    ]
  },
  

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
