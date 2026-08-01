import { Component, inject } from '@angular/core';
import { CardDetailStore } from '../../../services/card-detail-store';
import { CardPricePipe } from '../../../pipes/card-price.pipe';

@Component({
  selector: 'app-card-price',
  imports: [CardPricePipe],
  templateUrl: './price.html',
  styleUrl: './price.css',
})
export class CardPrice {
  private store = inject(CardDetailStore);
  card = this.store.card;
}
