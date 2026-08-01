import { Service, computed, signal } from '@angular/core';

const STORAGE_KEY = 'duelist-codex:favorites';

function loadIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

@Service()
export class FavoritesStore {
  readonly ids = signal<number[]>(loadIds());
  readonly count = computed(() => this.ids().length);

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number): void {
    const current = this.ids();
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];

    this.ids.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
