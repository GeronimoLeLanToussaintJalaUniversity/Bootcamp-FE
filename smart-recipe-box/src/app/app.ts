import { Component, signal ,computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipeModel } from './models';
import { MOCK_RECIPES } from './mock-recipes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly recipe = signal(MOCK_RECIPES[0] as RecipeModel);
  protected readonly title = signal('My Recipe Box');
    protected readonly servings = signal(1);
  protected readonly adjustedIngredients = computed(() => {
    const servings = this.servings();
    return this.recipe().ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * servings
    })); 
  });

  protected showSpaghetti(): void {
    this.recipe.set(MOCK_RECIPES[0] as RecipeModel);
  }
  protected showSalad(): void {
    this.recipe.set(MOCK_RECIPES[1] as RecipeModel);
  }
  protected increment(): void {
    this.servings.update(current => current + 1);
  }
  protected decrement(): void {
    this.servings.update(current => current - 1);
  }

}




