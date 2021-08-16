export type Bet = {
  id: string;
  customerId: string;
  gameId: string;
  roundId: string;
  createdAt: Date;
  endedAt: Date;
  betAmount: number;
  winAmount: number | null;
  canceled: boolean;
};
