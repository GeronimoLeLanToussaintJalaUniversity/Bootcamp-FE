import { Component, output, signal } from '@angular/core';

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

  type = signal('');
  typeChange = output<string>();
  attribute = signal('');
  attributeChange = output<string>();
  atkMin = signal<number | null>(null);
  atkMinChange = output<number | null>();
  atkMax = signal<number | null>(null);
  atkMaxChange = output<number | null>();
  defMin = signal<number | null>(null);
  defMinChange = output<number | null>();
  defMax = signal<number | null>(null);
  defMaxChange = output<number | null>();

  onNumberInput(event: Event, target: 'atkMin' | 'atkMax' | 'defMin' | 'defMax'): void {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? null : Number(raw);

    this[target].set(value);

    switch (target) {
      case 'atkMin':
        this.atkMinChange.emit(value);
        break;
      case 'atkMax':
        this.atkMaxChange.emit(value);
        break;
      case 'defMin':
        this.defMinChange.emit(value);
        break;
      case 'defMax':
        this.defMaxChange.emit(value);
        break;
    }
  }

  onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.type.set(value);
    this.typeChange.emit(value);
  }

  onAttributeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.attribute.set(value);
    this.attributeChange.emit(value);
  }
}
