import { Component, signal, input, computed } from '@angular/core';
import { RecipeModel } from '../models';
import { MOCK_RECIPES } from '../mock-recipes';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  readonly recipe = input.required<RecipeModel>();
  protected readonly servings = signal(1);
  protected readonly adjustedIngredients = computed(() => {
    const servings = this.servings();
    return this.recipe().ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * servings
    }));
  });
  protected increment(): void {
    this.servings.update(current => current + 1);
  }
  protected decrement(): void {
    this.servings.update(current => current - 1);
  }

}
