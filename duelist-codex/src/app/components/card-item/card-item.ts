import { Component, input, output } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItem {
  card = input.required<Card>();
  select = output<Card>();
}
