import { Component } from '@angular/core';
import { Father } from './model-example/father/father';
import { BindingComponent } from './model-example-Luigi/BindingComponent';

@Component({
  selector: 'app-root',
  imports: [Father, BindingComponent],
  templateUrl: './app.html'
})
export class App {}