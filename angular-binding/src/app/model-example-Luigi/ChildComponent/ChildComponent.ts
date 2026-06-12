import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'child-binding',
    imports: [FormsModule],
    templateUrl: './ChildComponent.html',
})
export class ChildComponent {
  colorChild = model('#000000'); 
}