import { Component, computed, inject, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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

  private debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  private cardsResource = resource({
    params: () => this.debouncedSearchTerm().trim(),
    loader: ({ params }) => this.cardService.getCards(params || undefined),
  });

  cards = computed(() => this.cardsResource.value() ?? []);
  loading = computed(() => this.cardsResource.isLoading());
  error = computed(() => {
    const err = this.cardsResource.error();
    return err ? (err as Error).message : null;
  });
}
