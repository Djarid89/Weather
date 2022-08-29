import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';

export enum ButtonColor {
  Default = 'default',
  Working = 'working',
  Done = 'done'
}

export enum ButtonState {
  Default = 0,
  Working,
  Done
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit, OnDestroy {
  @Input() buttonsTemplate = new Map<ButtonState, TemplateRef<any>>();
  @Output() btnClickEmitter = new EventEmitter<void>();
  buttonState = ButtonState.Default;
  ButtonState = ButtonState;
  startAddLocationSubs!: Subscription;
  saveZipCodeSubs!: Subscription;

  constructor(private readonly shared: SharedService) { }

  ngOnInit(): void {
    this.startAddLocationSubs = this.shared.startAddLocation$.subscribe({
      next: () => this.buttonState = ButtonState.Working
    })

    this.saveZipCodeSubs = this.shared.saveZipCode$.subscribe({
      next: () => {
        this.buttonState = ButtonState.Done;
        setTimeout(() => this.buttonState = ButtonState.Default, 500);
      }
    })
  }

  getColor(): ButtonColor {
    if(this.buttonState === ButtonState.Working) {
      return ButtonColor.Working;
    } else if(this.buttonState === ButtonState.Done) {
      return ButtonColor.Done;
    } else {
      return ButtonColor.Default;
    }
  }

  btnClick(): void {
    this.btnClickEmitter.emit();
  }

  ngOnDestroy(): void {
    this.startAddLocationSubs?.unsubscribe();
    this.saveZipCodeSubs?.unsubscribe();
  }
}
