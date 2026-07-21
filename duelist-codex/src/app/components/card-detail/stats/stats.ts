import { Component, inject } from '@angular/core';
import { CardDetailStore } from '../../../services/card-detail-store';

@Component({
  selector: 'app-card-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class CardStats {
  private store = inject(CardDetailStore);
  card = this.store.card;
}
