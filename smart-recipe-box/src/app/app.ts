import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('My Recipe Box');
  protected showSpaghetti(): void {
      console.log("Ver Spaghetti Carbonara");
    }
     protected showSalad(): void {
      console.log("Ver Caprese Salad");
    }
}




