import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'bold'
})
export class BoldPipe implements PipeTransform {

  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string, text: string): any {
    return this.sanitize(this.replace(value, text));
  }

  replace(str: string, text: string) {
    return str.replace(new RegExp(`(${text})`, 'gi'), '<b>$1</b>');
  }

  sanitize(str: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}