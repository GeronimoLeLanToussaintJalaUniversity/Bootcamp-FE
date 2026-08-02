import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card.model';
import { FavoritesStore } from '../../services/favorites';
import { HighlightCardDirective } from '../../directives/highlight-card.directive';

@Component({
  selector: 'app-card-item',
  imports: [RouterLink, HighlightCardDirective],
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItem {
  card = input.required<Card>();
  isFocused = input(false);
  focusToggle = output<Card>();

  private favorites = inject(FavoritesStore);
  isFavorite = computed(() => this.favorites.has(this.card().id));

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favorites.toggle(this.card().id);
  }

  onFocusToggle(event: Event): void {
    event.stopPropagation();
    this.focusToggle.emit(this.card());
  }
}
