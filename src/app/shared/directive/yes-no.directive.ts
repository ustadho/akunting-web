import { Pipe, PipeTransform, NgModule } from "@angular/core";

@Pipe({
  name: 'yesNo'
})
export class YesNoPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Ya' : 'Tidak';
  }
}

@NgModule({
  declarations: [ YesNoPipe ],
  exports: [ YesNoPipe ]
})

export class YesNoPipeModule {}