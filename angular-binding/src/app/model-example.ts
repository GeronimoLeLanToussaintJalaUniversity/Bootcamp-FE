import { Component, signal } from '@angular/core';
import { Child } from './child';

@Component({
  selector: 'app-model-example',
  imports: [Child],
  templateUrl: './model-example.html'
})
export class ModelExample {
    text ="El padre dice: Hola";
}