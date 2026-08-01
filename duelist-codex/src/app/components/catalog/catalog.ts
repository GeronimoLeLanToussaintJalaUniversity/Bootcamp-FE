import { Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardService } from '../../services/card';
import { CardItem } from '../card-item/card-item';
import { SearchBar } from '../search-bar/search-bar';
import { FavoritesStore } from '../../services/favorites';

@Component({
  selector: 'app-catalog',
  imports: [CardItem, SearchBar, RouterLink, RouterOutlet],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private cardService = inject(CardService);
  private favorites = inject(FavoritesStore);

  favoritesCount = this.favorites.count;
  searchTerm = signal('');

  private cardsResource = resource({
    loader: () => this.cardService.getCards(),
  });

  cards = computed(() => this.cardsResource.value() ?? []);
  loading = computed(() => this.cardsResource.isLoading());
  error = computed(() => {
    const err = this.cardsResource.error();
    return err ? (err as Error).message : null;
  });

  filteredCards = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.cards();
    }
    return this.cards().filter((card) => card.name.toLowerCase().includes(term));
  });
}
