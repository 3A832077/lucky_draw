export interface Prize {
  id: number;
  name: string;
  total_quantity: number;
  remaining_quantity: number;
  probability: number;
  color: string;
}

export interface Participant {
  id: number;
  name: string;
}

export interface LotteryRecord {
  id: number;
  participant_name: string;
  prize_name: string;
  prize_color: string;
  lottery_time: Date;
}

export interface LotteryResult {
  participant: Participant;
  prize: Prize;
}
