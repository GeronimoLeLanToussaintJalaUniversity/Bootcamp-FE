import { Component, signal } from '@angular/core';
import { Child } from '../child/child';

@Component({
  selector: 'app-father',
  imports: [Child],
  templateUrl: './father.html'
})
export class Father {
  text = signal('El padre dice: Hola');
}