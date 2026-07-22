import { Directive, computed, input } from '@angular/core';
import { Card } from '../models/card.model';

const HIGHLIGHT_ATK_THRESHOLD = 1200;

@Directive({
  selector: '[appHighlightCard]',
  host: {
    '[class.highlighted-card]': 'isHighlighted()',
  },
})
export class HighlightCardDirective {
  card = input.required<Card>({ alias: 'appHighlightCard' });

  isHighlighted = computed(() => (this.card().atk ?? 0) > HIGHLIGHT_ATK_THRESHOLD);
}
