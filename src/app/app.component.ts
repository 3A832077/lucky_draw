import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
              RouterOutlet, NzButtonModule, NzCardModule
           ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'lucky_draw';

  constructor() { }

  ngOnInit() {

  }

}
