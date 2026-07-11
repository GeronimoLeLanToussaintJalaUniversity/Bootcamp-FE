import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CardService } from '../services/card';
import { Card } from '../models/card.model';
import { CardItem } from './card-item/card-item';

@Component({
  selector: 'app-catalog',
  imports: [CardItem],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private cardService = inject(CardService);

  cards = signal<Card[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');

  filteredCards = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.cards();
    }
    return this.cards().filter((card) => card.name.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadCards();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  private async loadCards(query?: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const cards = await this.cardService.getCards(query);
      this.cards.set(cards);
    } catch {
      this.error.set('No se pudieron cargar las cartas. Intentá de nuevo más tarde.');
    } finally {
      this.loading.set(false);
    }
  }
}
