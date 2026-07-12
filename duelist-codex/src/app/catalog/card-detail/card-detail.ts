import { Component, input, output } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  card = input.required<Card>();
  close = output<void>();
}
