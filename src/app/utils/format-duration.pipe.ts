import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from './format-duration';

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return formatDuration(value);
  }

}
