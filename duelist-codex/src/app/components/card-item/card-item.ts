import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-item',
  imports: [RouterLink],
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItem {
  card = input.required<Card>();
}
