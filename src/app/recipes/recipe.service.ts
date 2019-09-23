import {Recipe} from "./recipes.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Burger KING',
            'This is a burger.',
            'https://herfybd.com/assets/image/combo_cheese_burger.png',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe(
            'Pizza',
            'Pizza Italiana',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG2v_jQepbRd1ab05IGvSS7MUYZ0DTrupUoNbEBfGoDtb7b8Ch',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ])
    ];
    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice(); // ravi kopiju arraya i vraca da ne mozemo mjenjati u getteru
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }
}
