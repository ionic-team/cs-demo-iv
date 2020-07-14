import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: HomePage },
      {
        path: 'edit-tea-category',
        loadChildren: () =>
          import('../edit-tea-category/edit-tea-category.module').then(
            m => m.EditTeaCategoryPageModule,
          ),
      },
    ]),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
