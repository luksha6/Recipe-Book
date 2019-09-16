import { Component, OnInit } from '@angular/core';
import { Recipe } from "../recipes.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
      new Recipe('A Test Recipe', 'This is simply a test', 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/nachos_92445_16x9.jpg'),
      new Recipe('A Test Recipe', 'This is simply a test', 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/nachos_92445_16x9.jpg')
  ];

  constructor() { }

  ngOnInit() {
  }

}
