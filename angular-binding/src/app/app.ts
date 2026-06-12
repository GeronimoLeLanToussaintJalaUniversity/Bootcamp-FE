import { Component } from '@angular/core';
import { Father } from './model-example/father/father';

@Component({
  selector: 'app-root',
  imports: [Father],
  templateUrl: './app.html'
})
export class App {}