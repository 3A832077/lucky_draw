import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prize, LotteryResult } from '../models/lottery.model';
import { env } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {

  constructor(private http: HttpClient) { }

  /**
   * 取得所有獎項
   */
  getPrizes(): Observable<Prize[]> {
    return this.http.get<Prize[]>(`${env.apiUrl}/prizes`);
  }

  /**
   * 抽獎
   * @param params
   */
  drawLottery(params: any): Observable<LotteryResult> {
    return this.http.post<LotteryResult>(`${env.apiUrl}/lottery/draw`, params);
  }

}
