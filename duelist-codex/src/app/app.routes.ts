import { Routes } from '@angular/router';
import { Catalog } from './components/catalog/catalog';
import { CardDetail } from './components/card-detail/card-detail';
import { CardEffect } from './components/card-detail/effect/effect';
import { CardStats } from './components/card-detail/stats/stats';
import { CardPrice } from './components/card-detail/price/price';
import { CardDetailStore } from './services/card-detail-store';
import { cardResolver } from './resolvers/card.resolver';

export const routes: Routes = [
  {
    path: '',
    component: Catalog,
    children: [
      {
        path: 'card/:id',
        component: CardDetail,
        providers: [CardDetailStore],
        resolve: { card: cardResolver },
        children: [
          { path: '', redirectTo: 'effect', pathMatch: 'full' },
          { path: 'effect', component: CardEffect },
          { path: 'stats', component: CardStats },
          { path: 'price', component: CardPrice },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
