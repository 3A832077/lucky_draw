export interface Prize {
  id: number;
  name: string;
  total_quantity: number;
  remaining_quantity: number;
  color: string;
  picture: string;
}

export interface LotteryResult {
  prize: Prize;
}
