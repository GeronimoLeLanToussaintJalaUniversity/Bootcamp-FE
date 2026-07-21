import { Routes } from '@angular/router';
import { Catalog } from './components/catalog/catalog';
import { CardDetail } from './components/card-detail/card-detail';

export const routes: Routes = [
  {
    path: '',
    component: Catalog,
    children: [{ path: 'card/:id', component: CardDetail }],
  },
];
