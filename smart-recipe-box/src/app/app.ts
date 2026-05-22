import { Component, signal } from '@angular/core';
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
  protected showSpaghetti(): void {
     this.recipe.set(MOCK_RECIPES[0] as RecipeModel);
    }
     protected showSalad(): void {
      this.recipe.set(MOCK_RECIPES[1] as RecipeModel);
    }
    

}




