import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { LotteryWheelComponent } from './lottery-wheel/lottery-wheel.component';

@Component({
    selector: 'app-root',
    imports: [
                NzButtonModule, NzCardModule,NzLayoutModule,
                NzDividerModule, LotteryWheelComponent,
             ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(

             ){ }

  ngOnInit() {

  }


}
