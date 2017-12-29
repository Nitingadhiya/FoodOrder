/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */

import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

    transform(value: number): string {
      console.log(value);
      if(!value)
      {
        value =900;
      }
       const minutes: any = ('00'+ Math.floor(value/60)).slice(-2);
       return minutes + ':' + ('00'+Math.floor(value-minutes * 60)).slice(-2);;
    }

}
