import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CardDetailStore } from '../services/card-detail-store';

export const cardResolver: ResolveFn<void> = async (route) => {
  const store = inject(CardDetailStore);
  const id = route.paramMap.get('id') ?? '';
  await store.load(id);
};
