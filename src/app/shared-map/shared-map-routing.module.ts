import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedMapPage } from './shared-map.page';

const routes: Routes = [
  {
    path: '',
    component: SharedMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedMapPageRoutingModule {}
