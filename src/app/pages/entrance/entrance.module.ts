import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntrancePageRoutingModule } from './entrance-routing.module';

import { EntrancePage } from './entrance.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntrancePageRoutingModule,
    SharedModule
  ],
  declarations: [EntrancePage]
})
export class EntrancePageModule {}
