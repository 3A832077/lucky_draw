import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LotteryService } from './lottery-wheel.service';
import { LotteryResult, Prize } from '../models/lottery.model';

@Component({
  selector: 'lottery-wheel',
  imports: [
              CommonModule, FormsModule, NzCardModule,
              NzButtonModule, NzInputModule, NzFormModule,
              NzDividerModule, NzTagModule
            ],
  templateUrl: './lottery-wheel.component.html',
  styleUrl: './lottery-wheel.component.css'
})
export class LotteryWheelComponent implements OnInit, AfterViewInit {

  @ViewChild('wheelCanvas', { static: true }) wheelCanvas!: ElementRef<HTMLCanvasElement>;

  prizes: any[] = [];

  isSpinning = false;

  currentParticipant = '';

  lastWinner: LotteryResult | null = null;

  canvas!: HTMLCanvasElement;

  ctx!: CanvasRenderingContext2D;

  centerX = 0;

  centerY = 0;

  radius = 0;

  angle = 0;

  random = Math.random();

  constructor(
                private lotteryService: LotteryService,
                private message: NzMessageService
              ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!this.wheelCanvas) {
      console.error('wheelCanvas 尚未初始化');
      return;
    }

    this.canvas = this.wheelCanvas.nativeElement;

    if (!this.canvas) {
      console.error('canvas 尚未取得');
      return;
    }

    this.ctx = this.canvas.getContext('2d')!;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.canvas.width, this.canvas.height) / 2;

    this.loadPrizes();
  }

  loadPrizes(): void {
    this.lotteryService.getPrizes().subscribe(prizes => {
      this.prizes = prizes.map(p => ({
        ...p,
        probability: (p.probability || 0) / 100
      }));
      this.drawWheel();
    });
  }

  drawWheel(): void {
    if (!this.ctx) {
      console.error('❌ ctx 沒初始化');
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let startAngle = 0;
    let endAngle = 0;

    for (let i = 0; i < this.prizes.length; i++) {
      const prize = this.prizes[i];
      startAngle = endAngle;
      endAngle = startAngle + (Math.PI * 2 * prize.probability);

      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
      this.ctx.lineTo(this.centerX, this.centerY);
      this.ctx.fillStyle = prize.color;
      this.ctx.fill();

      // 畫文字
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate((startAngle + endAngle) / 2);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(prize.name, this.radius / 2, 0);
      this.ctx.restore();
    }
  }

  spin(): void {
    if (this.isSpinning || !this.currentParticipant) {
      this.message.warning('請先輸入姓名！');
      return;
    }
    this.isSpinning = true;

    this.lotteryService.drawLottery(this.currentParticipant).subscribe(
      result => {
        this.lastWinner = result;
        const prizeIndex = this.prizes.findIndex(p => p.id === result.prize.id);
        if (prizeIndex === -1) {
          this.message.error('找不到中獎獎項，轉盤無法對應');
          return;
        }
        this.animateSpin(prizeIndex);
      },
      error => {
        this.message.error('抽獎失敗！');
        this.isSpinning = false;
      }
    );
  }

  animateSpin(index: number): void {
    if (!this.isSpinning) return;

    const count = this.prizes.length;
    const anglePerPrize = 360 / count;
    const targetAngle = 360 * 5 + (count - index) * anglePerPrize;

    const wheel = this.canvas
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
      this.showResult();
      this.isSpinning = false;
    }, 5000);
  }

  showResult(): void {
    if (this.lastWinner) {
      this.message.success(`恭喜抽中 ${this.lastWinner.prize.name}！`);
    }
  }

  resetWheel(): void {
    if (this.canvas) {
      this.canvas.style.transition = 'transform 1s ease-out';
      this.canvas.style.transform = 'rotate(0deg)';
    }
    this.angle = 0;
    this.isSpinning = false;
    this.lastWinner = null;
  }




}
