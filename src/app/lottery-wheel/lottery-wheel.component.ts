import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LotteryService } from './lottery-wheel.service';
import { LotteryResult } from '../models/lottery.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { type NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'lottery-wheel',
  imports: [
    CommonModule, FormsModule, NzCardModule,
    NzButtonModule, NzInputModule, NzFormModule,
    NzDividerModule, NzTagModule, NzGridModule,
    NzIconModule,
],
  templateUrl: './lottery-wheel.component.html',
  styleUrl: './lottery-wheel.component.css'
})
export class LotteryWheelComponent implements OnInit, AfterViewInit {

  @ViewChild('wheelCanvas', { static: true }) wheelCanvas!: ElementRef<HTMLCanvasElement>;

  // @ViewChild('resultTemplate', { static: true }) customTemplate!: TemplateRef<any>;

  @ViewChild('resultTemplate', { static: true }) template?: TemplateRef<{
    $implicit: NzNotificationComponent;
    data: { name: string; color: string; img: string };
  }>;

  prizes: any[] = [];

  isSpinning = false;

  lastWinner: LotteryResult | null = null;

  canvas!: HTMLCanvasElement;

  ctx!: CanvasRenderingContext2D;

  centerX = 0;

  centerY = 0;

  radius = 0;

  angle = 0;

  random = Math.random();

  hasDrawn = false;

  constructor(
                private lotteryService: LotteryService,
                private message: NzMessageService,
                @Inject(PLATFORM_ID) private platformId: Object,
                private notificationService: NzNotificationService
              ) { }

  ngOnInit(): void {
  }

  /**
   * 初始化畫布和轉盤
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initCanvas();
      }, 0);
    }
  }

  initCanvas(): void {
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

  /**
   * 獲取獎品列表
   */
  loadPrizes(): void {
    this.lotteryService.getPrizes().subscribe(prizes => {
      const totalWeight = prizes.reduce((sum, prize) => sum + prize.total_quantity, 0);

      this.prizes = prizes.map(p => ({...p, probability: (p.total_quantity || 0) / totalWeight}));

      if (this.prizes.length > 0 && this.ctx) {
        this.drawWheel();
      }
    });
  }

  /**
   * 畫轉盤
   */
  drawWheel(angle: number = 0): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const angleOffset = -Math.PI / 2; // 調整轉盤起點到上方
    const anglePerPrize = (Math.PI * 2) / this.prizes.length;
    let startAngle = angle;
    let endAngle = angle;

    for (let i = 0; i < this.prizes.length; i++) {
      const prize = this.prizes[i];
      startAngle = endAngle;
      endAngle = startAngle + anglePerPrize;

      this.ctx.beginPath();
      this.ctx.arc(
        this.centerX,
        this.centerY,
        this.radius,
        startAngle + angleOffset,
        endAngle + angleOffset
      );
      this.ctx.lineTo(this.centerX, this.centerY);
      this.ctx.fillStyle = prize.color;
      this.ctx.fill();

      // 畫文字
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate((startAngle + endAngle) / 2 + angleOffset);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(prize.name, this.radius / 2, 0);
      this.ctx.restore();
    }
  }

  /**
   * 開始抽獎
   */
  spin(): void {
    if (this.hasDrawn) {
      return;
    }
    const params = {};
    this.isSpinning = true;
    this.lotteryService.drawLottery(params).subscribe({
      next: result => {
        this.lastWinner = result;
        const prizeIndex = this.prizes.findIndex(p => p.id === result.prize.id);
        if (prizeIndex === -1) {
          this.message.error('找不到中獎獎項，轉盤無法對應');
          return;
        }
        this.animateSpin(prizeIndex);
        this.hasDrawn = true;
      },
      error: error => {
        if (error?.error?.error)
        {
          this.message.error('抽獎失敗，請稍後再試');
        }
      }
    });
  }

  /**
   * 動畫效果
   * @param index
   */
  animateSpin(index: number): void {
    if (!this.isSpinning) return;

    const count = this.prizes.length;
    const anglePerPrize = 2 * Math.PI / count;
    const targetAngle = 2 * Math.PI * 4 + (count - index - 0.5) * anglePerPrize;
    const totalSpin = 2 * Math.PI * 4 + targetAngle;
    const duration = 5000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = totalSpin * easeOut(progress);

      this.drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
      else {
        this.showResult();
        this.isSpinning = false;
      }
    };

    requestAnimationFrame(animate);

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }
  }

  /**
   * 顯示抽獎結果
   */
  showResult(): void {
    if (this.lastWinner) {
      const prize = this.lastWinner.prize;
      this.notificationService.template(this.template!, {
        nzData: { prize: prize.name, color: prize.color, img: prize.picture },
        nzPlacement: 'top',
      });
    }
  }





}
