import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CostsPage } from './costs.page';

const routes: Routes = [
  {
    path: '',
    component: CostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostsPageRoutingModule {}
