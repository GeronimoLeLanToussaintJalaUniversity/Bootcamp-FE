import { Component } from '@angular/core';
import { ModelExample } from './model-example';

@Component({
  selector: 'app-root',
  imports: [ModelExample],
  templateUrl: './app.html'
})
export class App {}