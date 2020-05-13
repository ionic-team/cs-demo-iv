import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication';
import { TeaCategory } from '../models/tea-category';
import { TeaCategoriesService } from '../services/tea-categories';
import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy, OnInit {
  private subscription: Subscription;
  categories: Array<TeaCategory>;

  constructor(
    private authentication: AuthenticationService,
    private toastController: ToastController,
    private teaCategories: TeaCategoriesService
  ) {}

  ngOnInit() {
    this.subscription = this.teaCategories.changed.subscribe(() => this.getData());
  }

  ionViewDidEnter() {
    this.getData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.authentication
      .logout()
      .pipe(
        catchError(async err => {
          const toast = await this.toastController.create({
            message: 'Logout Failed! Please try again.',
            color: 'danger',
            duration: 1500,
            position: 'top'
          });
          toast.present();
          return EMPTY;
        })
      )
      .subscribe();
  }

  private getData() {
    this.teaCategories.getAll().subscribe(x => (this.categories = x));
  }
}
