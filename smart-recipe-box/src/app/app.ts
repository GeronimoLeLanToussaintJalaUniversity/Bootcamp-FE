import { Component, computed, signal } from '@angular/core';
import { MOCK_RECIPES } from './mock-recipes';
import { RecipeCard } from './recipe-card/recipe-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RecipeCard, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('My Recipe Box');
  protected readonly recipes = signal(MOCK_RECIPES);
  protected readonly searchTerm = signal('');
  protected readonly filteredRecipes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.recipes().filter(recipe => recipe.name.toLowerCase().includes(term));
  });
}




