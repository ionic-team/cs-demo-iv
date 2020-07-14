import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { TeaCategoriesService } from '../services/tea-categories';

@Component({
  selector: 'app-edit-tea-category',
  templateUrl: './edit-tea-category.page.html',
  styleUrls: ['./edit-tea-category.page.scss'],
})
export class EditTeaCategoryPage implements OnInit {
  private id: number;
  name: string;
  description: string;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private teaCategories: TeaCategoriesService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.teaCategories.get(parseInt(id, 10)).subscribe(c => {
      this.id = c && c.id;
      this.name = c && c.name;
      this.description = c && c.description;
    });
  }

  save() {
    this.teaCategories
      .save({
        id: this.id,
        name: this.name,
        description: this.description,
      })
      .subscribe(() => this.navController.back());
  }
}
