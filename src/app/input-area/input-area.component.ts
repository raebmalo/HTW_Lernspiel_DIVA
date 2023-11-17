import { Component } from '@angular/core';

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrl: './input-area.component.css'
})
export class InputAreaComponent {
  dynamicText: string = 'Initial text in the textbox';
  buttonText: string = ''; // Text that will be displayed in the right column

  updateText(text: string): void {
    // Update the text in the right column
    if(!this.buttonText) this.buttonText = text;
    else this.buttonText = this.buttonText + "\n" + text;
  }
}
