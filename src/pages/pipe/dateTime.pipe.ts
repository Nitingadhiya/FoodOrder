/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */

import {Pipe} from '@angular/core';

@Pipe({ name: 'dateTime' })
export class DateTimePipe {

  transform(value: any,arg1:any) :any {
      var dateTime = value;
      console.log(arg1+"*********");
      if(dateTime)
      {
        var splt = dateTime.split('T');
        var date = splt[0];
        var date_formate = date.split('-');
        var time_split = splt[1];
        var time = time_split.split(':');
        var date_time = '';
        if(arg1 == "date")
        {
          date_time = date_formate[0]+"."+date_formate[1]+"."+date_formate[2];
        }else
        {
          date_time = time[0]+":"+time[1]+", "+ date_formate[0]+"/"+date_formate[1]+"/"+date_formate[2];
        }

      }
      return date_time;
    }
}
