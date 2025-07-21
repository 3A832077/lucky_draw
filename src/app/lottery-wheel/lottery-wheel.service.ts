import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prize, Participant, LotteryRecord, LotteryResult } from '../models/lottery.model';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  
  getPrizes(): Observable<Prize[]> {
    return this.http.get<Prize[]>(`${this.apiUrl}/prizes`);
  }

  getParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.apiUrl}/participants`);
  }

  addParticipants(names: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/participants`, { names });
  }

  drawLottery(participantName: string): Observable<LotteryResult> {
    return this.http.post<LotteryResult>(`${this.apiUrl}/lottery/draw`, { participantName });
  }

}
