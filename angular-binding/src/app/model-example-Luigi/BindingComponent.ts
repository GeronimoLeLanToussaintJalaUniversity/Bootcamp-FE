import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildComponent } from './ChildComponent/ChildComponent';

@Component({
    selector: 'data-binding',
    imports: [FormsModule, ChildComponent],
    templateUrl: './BindingComponent.html',
})
export class BindingComponent {
  myColor = model('#000000'); 
}