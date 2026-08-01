import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card';
import { FavoritesStore } from '../../services/favorites';
import { CardItem } from '../card-item/card-item';

@Component({
  selector: 'app-collection',
  imports: [CardItem, RouterLink],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
})
export class Collection implements OnInit {
  private cardService = inject(CardService);
  private favorites = inject(FavoritesStore);

  private loadedCards = signal<Card[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  cards = computed(() => this.loadedCards().filter((card) => this.favorites.has(card.id)));

  ngOnInit(): void {
    this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const cards = await Promise.all(
        this.favorites.ids().map((id) => this.cardService.getCard(String(id))),
      );
      this.loadedCards.set(cards.filter((card): card is Card => card !== null));
    } catch {
      this.error.set('No se pudo cargar tu colección. Intentá de nuevo más tarde.');
    } finally {
      this.loading.set(false);
    }
  }
}
