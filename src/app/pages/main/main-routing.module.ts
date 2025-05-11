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
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'registers',
        loadChildren: () => import('./registers/registers.module').then( m => m.RegistersPageModule)
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
        path: 'providers',
        loadChildren: () => import('./providers/providers.module').then( m => m.ProvidersPageModule)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.module').then( m => m.AccountsPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('./employees/employees.module').then( m => m.EmployeesPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
