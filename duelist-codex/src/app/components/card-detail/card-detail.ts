import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardDetailStore } from '../../services/card-detail-store';
import { Tabs, TabLink } from '../shared/tabs/tabs';

@Component({
  selector: 'app-card-detail',
  imports: [Tabs, RouterLink, RouterOutlet],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  private store = inject(CardDetailStore);

  card = this.store.card;
  error = this.store.error;

  readonly tabs: TabLink[] = [
    { label: 'Efecto', link: 'effect' },
    { label: 'Estadísticas', link: 'stats' },
    { label: 'Precio', link: 'price' },
  ];
}
