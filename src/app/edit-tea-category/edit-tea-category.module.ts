import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditTeaCategoryPage } from './edit-tea-category.page';

const routes: Routes = [
  {
    path: ':id',
    component: EditTeaCategoryPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [EditTeaCategoryPage],
})
export class EditTeaCategoryPageModule {}
