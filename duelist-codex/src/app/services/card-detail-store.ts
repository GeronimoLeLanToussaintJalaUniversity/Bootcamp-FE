import { Service, inject, signal } from '@angular/core';
import { Card } from '../models/card.model';
import { CardService } from './card';

@Service()
export class CardDetailStore {
  private cardService = inject(CardService);

  readonly card = signal<Card | null>(null);
  readonly error = signal<string | null>(null);

  async load(id: string): Promise<void> {
    this.error.set(null);
    this.card.set(null);

    try {
      const card = await this.cardService.getCard(id);
      if (card) {
        this.card.set(card);
      } else {
        this.error.set('No se encontró la carta solicitada.');
      }
    } catch {
      this.error.set('No se pudo cargar la carta. Intentá de nuevo más tarde.');
    }
  }
}
