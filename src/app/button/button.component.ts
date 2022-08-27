import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum ButtonColor {
  Default = 'default',
  Working = 'working',
  Done = 'done'
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() color!: ButtonColor;
  @Output() btnClickEmitter = new EventEmitter<void>()

  btnClick(): void {
    this.btnClickEmitter.emit();
  }

}
