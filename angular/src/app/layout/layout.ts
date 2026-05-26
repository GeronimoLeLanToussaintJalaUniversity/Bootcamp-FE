import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  sidebarVisible = signal(true);

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }
}
