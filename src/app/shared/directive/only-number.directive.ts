import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[onlynumber]'
})
export class OnlyNumberDirective {
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
    'Find'
  ];
  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {

    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'f' && e.ctrlKey === true) || // Allow: Ctrl+F
      (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) || // Allow: Cmd+X (Mac)
      (e.key === 'f' && e.metaKey === true) // Allow: Cmd+F (Mac)

    ) {
      // let it happen, don't do anything
      return;
    }

    // Ensure that it is a number and stop the keypress
    // if (
    //   (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
    //   (e.keyCode < 96 || e.keyCode > 105)
    // ) {
    //   e.preventDefault();
    // }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData.getData('text/plain').trim()

    // .replace(/\D/g, '');
    let strRegExp = /\W/g; // get a spesial character-only string
    let regexKoma = /\.(.*?[0]*)|,/g // remove .00 in number
    let regexTitik = /,(,*?[0]*)|\./g // remove ,00 in number
    let arrNonWord = pastedInput.match(strRegExp);

    if (arrNonWord === null) {
      let formatCurrency = new Intl.NumberFormat().format(parseInt(pastedInput));
      document.execCommand('insertText', false, pastedInput);
    } else if (arrNonWord[0] === '.') {
      let result = pastedInput.replace(regexTitik, "")
      document.execCommand('insertText', false, result);
    } else if (arrNonWord[0] === ',') {
      let result = pastedInput.replace(regexKoma, "")
      document.execCommand('insertText', false, result);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }
}
