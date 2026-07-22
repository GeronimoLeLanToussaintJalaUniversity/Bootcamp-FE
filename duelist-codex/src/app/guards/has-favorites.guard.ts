import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FavoritesStore } from '../services/favorites';

export const hasFavoritesGuard: CanActivateFn = () => {
  const favorites = inject(FavoritesStore);
  const router = inject(Router);

  if (favorites.count() > 0) {
    return true;
  }

  return router.navigate(['/']);
};
