import { Component, model } from '@angular/core';

const CARD_TYPES = [
  'Effect Monster',
  'Normal Monster',
  'Ritual Monster',
  'Fusion Monster',
  'Synchro Monster',
  'XYZ Monster',
  'Link Monster',
  'Pendulum Effect Monster',
  'Spell Card',
  'Trap Card',
] as const;

const CARD_ATTRIBUTES = ['DARK', 'EARTH', 'FIRE', 'LIGHT', 'WATER', 'WIND', 'DIVINE'] as const;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  types = CARD_TYPES;
  attributes = CARD_ATTRIBUTES;

  type = model('');
  attribute = model('');
  atkMin = model<number | null>(null);
  atkMax = model<number | null>(null);
  defMin = model<number | null>(null);
  defMax = model<number | null>(null);

  onNumberInput(event: Event, target: 'atkMin' | 'atkMax' | 'defMin' | 'defMax'): void {
    const value = (event.target as HTMLInputElement).value;
    this[target].set(value === '' ? null : Number(value));
  }
}
