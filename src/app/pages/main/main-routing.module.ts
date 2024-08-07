import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'registers',
        loadChildren: () => import('./registers/registers.module').then( m => m.RegistersPageModule)
      }
    ]
  },  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
  },
  {
    path: 'bills',
    loadChildren: () => import('./bills/bills.module').then( m => m.BillsPageModule)
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
