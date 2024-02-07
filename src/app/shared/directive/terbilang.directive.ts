import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'terbilang',
})
export class TerbilangPipe implements PipeTransform {
  transform(value: any): string {
    if (value && isInteger(value)) return terbilang(value);

    return value;
  }
}

@NgModule({
  declarations: [TerbilangPipe],
  exports: [TerbilangPipe],
})
export class TerbilangModule {}

const isInteger = function (x: any) {
  return x % 1 === 0;
};

let terbilang = (nilai) => {
  nilai = Math.floor(Math.abs(nilai));

  var simpanNilaiBagi = 0;
  var huruf = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];
  var temp = '';

  if (nilai < 12) {
    temp = ' ' + huruf[nilai];
  } else if (nilai < 20) {
    temp = terbilang(Math.floor(nilai - 10)) + ' Belas';
  } else if (nilai < 100) {
    simpanNilaiBagi = Math.floor(nilai / 10);
    temp = terbilang(simpanNilaiBagi) + ' Puluh' + terbilang(nilai % 10);
  } else if (nilai < 200) {
    temp = ' Seratus' + terbilang(nilai - 100);
  } else if (nilai < 1000) {
    simpanNilaiBagi = Math.floor(nilai / 100);
    temp = terbilang(simpanNilaiBagi) + ' Ratus' + terbilang(nilai % 100);
  } else if (nilai < 2000) {
    temp = ' Seribu' + terbilang(nilai - 1000);
  } else if (nilai < 1000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000);
    temp = terbilang(simpanNilaiBagi) + ' Ribu' + terbilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000);
    temp = terbilang(simpanNilaiBagi) + ' Juta' + terbilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000);
    temp =
      terbilang(simpanNilaiBagi) + ' Miliar' + terbilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000000);
    temp = terbilang(nilai / 1000000000000) + ' Triliun' + terbilang(nilai % 1000000000000);
  }

  return temp;
};
