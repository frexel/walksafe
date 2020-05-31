import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedMapPageRoutingModule } from './shared-map-routing.module';

import { SharedMapPage } from './shared-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedMapPageRoutingModule
  ],
  declarations: [SharedMapPage]
})
export class SharedMapPageModule {}
