import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../services/auth.service';
import { UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [HasRoleDirective, UpperCasePipe, LowerCasePipe, TitleCasePipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  authService = inject(AuthService);
  windowWidth = signal(window.innerWidth);
  manualOverride = signal<boolean | null>(null);
  roles = "hola como vas";

  sidebarVisible = computed(() => {
    if (this.manualOverride() !== null) return this.manualOverride();
    return this.windowWidth() > 800;
  });

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
    if (this.manualOverride()) {
      this.manualOverride.set(null);
    }
  }

  toggleSidebar() {
    this.manualOverride.set(!this.sidebarVisible());
  }
}