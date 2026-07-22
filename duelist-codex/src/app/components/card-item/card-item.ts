import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card.model';
import { FavoritesStore } from '../../services/favorites';

@Component({
  selector: 'app-card-item',
  imports: [RouterLink],
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItem {
  card = input.required<Card>();

  private favorites = inject(FavoritesStore);
  isFavorite = computed(() => this.favorites.has(this.card().id));

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favorites.toggle(this.card().id);
  }
}
