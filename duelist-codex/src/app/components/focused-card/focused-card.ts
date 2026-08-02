import { Component, input, output } from '@angular/core';
import { Card } from '../../models/card.model';
import { CardItem } from '../card-item/card-item';

@Component({
  selector: 'app-focused-card',
  imports: [CardItem],
  templateUrl: './focused-card.html',
  styleUrl: './focused-card.css',
})
export class FocusedCard {
  card = input<Card | null>(null);
  focusToggle = output<Card>();
}
