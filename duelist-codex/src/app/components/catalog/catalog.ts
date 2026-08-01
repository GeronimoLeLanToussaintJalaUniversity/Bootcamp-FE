import { Component, computed, inject, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardService } from '../../services/card';
import { CardItem } from '../card-item/card-item';
import { SearchBar } from '../search-bar/search-bar';
import { Filters } from '../filters/filters';
import { FavoritesStore } from '../../services/favorites';

@Component({
  selector: 'app-catalog',
  imports: [CardItem, SearchBar, Filters, RouterLink, RouterOutlet],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private cardService = inject(CardService);
  private favorites = inject(FavoritesStore);

  favoritesCount = this.favorites.count;

  searchTerm = signal('');
  type = signal('');
  attribute = signal('');
  atkMin = signal<number | null>(null);
  atkMax = signal<number | null>(null);
  defMin = signal<number | null>(null);
  defMax = signal<number | null>(null);

  private debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  private serverFilters = computed(() => ({
    name: this.debouncedSearchTerm().trim(),
    type: this.type(),
    attribute: this.attribute(),
  }));

  private cardsResource = resource({
    params: () => this.serverFilters(),
    loader: ({ params }) =>
      this.cardService.getCards({
        name: params.name || undefined,
        type: params.type || undefined,
        attribute: params.attribute || undefined,
      }),
  });

  cards = computed(() => this.cardsResource.value() ?? []);
  loading = computed(() => this.cardsResource.isLoading());
  error = computed(() => {
    const err = this.cardsResource.error();
    return err ? (err as Error).message : null;
  });

  filteredCards = computed(() => {
    const atkMin = this.atkMin();
    const atkMax = this.atkMax();
    const defMin = this.defMin();
    const defMax = this.defMax();

    return this.cards().filter((card) => {
      if (atkMin !== null && (card.atk ?? -Infinity) < atkMin) return false;
      if (atkMax !== null && (card.atk ?? Infinity) > atkMax) return false;
      if (defMin !== null && (card.def ?? -Infinity) < defMin) return false;
      if (defMax !== null && (card.def ?? Infinity) > defMax) return false;
      return true;
    });
  });

  hasActiveFilters = computed(
    () =>
      Boolean(this.searchTerm().trim() || this.type() || this.attribute()) ||
      this.atkMin() !== null ||
      this.atkMax() !== null ||
      this.defMin() !== null ||
      this.defMax() !== null,
  );
}
