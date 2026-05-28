import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal({ role: 'admin' });

  toggleRole() {
    this.currentUser.update(user => ({
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin'
    }));
  }
}
