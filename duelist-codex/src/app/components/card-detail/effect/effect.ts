import { Component, inject } from '@angular/core';
import { CardDetailStore } from '../../../services/card-detail-store';

@Component({
  selector: 'app-card-effect',
  templateUrl: './effect.html',
  styleUrl: './effect.css',
})
export class CardEffect {
  private store = inject(CardDetailStore);
  card = this.store.card;
}
