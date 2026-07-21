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

    try {
      const card = await this.cardService.getCard(id);
      this.card.set(card);
    } catch {
      this.error.set('No se pudo cargar la carta. Intentá de nuevo más tarde.');
    }
  }
}
