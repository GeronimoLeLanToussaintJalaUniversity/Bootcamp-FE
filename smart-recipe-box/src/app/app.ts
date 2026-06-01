import { Component, signal   } from '@angular/core';
import { RecipeModel } from './models';
import { MOCK_RECIPES } from './mock-recipes';
import { RecipeCard } from './recipe-card/recipe-card';

@Component({
  selector: 'app-root',
  imports: [RecipeCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('My Recipe Box');
  protected readonly recipe = signal(MOCK_RECIPES[0] as RecipeModel);


  protected showSpaghetti(): void {
    this.recipe.set(MOCK_RECIPES[0] as RecipeModel);
  }
  protected showSalad(): void {
    this.recipe.set(MOCK_RECIPES[1] as RecipeModel);
  }


}




