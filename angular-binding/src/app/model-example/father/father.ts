import { Component, signal, computed } from '@angular/core';
import { Child } from '../child/child';

@Component({
  selector: 'app-father',
  imports: [Child],
  templateUrl: './father.html'
})
export class Father {
  text = signal('');

  items = ['list', 'of', 'words', 'in', 'order', 'to', 'test', 'the', 'filtering', 'functionality'];

  filteredItems = computed(() =>
    this.items.filter(item =>
      item.toLowerCase().includes(this.text().toLowerCase())
    )
  );
}