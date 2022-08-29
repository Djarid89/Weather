import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CodeName } from '../zipcode-entry.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() items: CodeName[] = [];
  @Output() itemSelectedEmitter = new EventEmitter<string>();
  @HostListener('document:click', ['$event']) clickout(event: any) {
    if(this.filteredItems.length && !this.eRef.nativeElement.contains(event.target)) {
      this.text = '';
      this.filteredItems = [];
    }
  }

  text = '';
  filteredItems: CodeName[] = [];

  constructor(private eRef: ElementRef) {}

  selectCountry(item: CodeName): void {
    this.text = item.name;
    this.filteredItems = [];
    this.itemSelectedEmitter.emit(item.code);
  }

  filterItems(text?: string): void {
    this.text = text || '';
    this.itemSelectedEmitter.emit();
    this.filteredItems = text ? this.items?.filter((item: CodeName) => item.name.toLowerCase().includes(this.text.toLowerCase())) || [] : [...this.items];
  }
}
