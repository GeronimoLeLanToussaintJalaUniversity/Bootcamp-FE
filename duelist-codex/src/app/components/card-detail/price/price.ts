import { Component, inject } from '@angular/core';
import { CardDetailStore } from '../../../services/card-detail-store';

@Component({
  selector: 'app-card-price',
  templateUrl: './price.html',
  styleUrl: './price.css',
})
export class CardPrice {
  private store = inject(CardDetailStore);
  card = this.store.card;
}
