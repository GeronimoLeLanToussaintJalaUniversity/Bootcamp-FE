import { Component, signal, computed, HostListener, inject } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  windowWidth = signal(window.innerWidth);
  manualOverride = signal<boolean | null>(null);

  sidebarVisible = computed(() => {
    if (this.manualOverride() !== null) return this.manualOverride();
    return this.windowWidth() > 800;
  });

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
    if (this.manualOverride() ) {
      this.manualOverride.set(null);
    }
  }

  toggleSidebar() {
    this.manualOverride.set(!this.sidebarVisible());
  }
}