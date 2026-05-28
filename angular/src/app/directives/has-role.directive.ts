import { Directive, TemplateRef, ViewContainerRef, inject, effect, input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({ selector: '[appHasRole]', standalone: true })
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  appHasRole = input<string>();

  constructor() {
    effect(() => {
      this.viewContainer.clear();
      if (this.authService.currentUser().role === this.appHasRole()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
