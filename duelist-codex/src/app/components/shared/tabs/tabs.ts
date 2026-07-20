import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  labels = input.required<string[]>();
  activeIndex = model(0);
}
