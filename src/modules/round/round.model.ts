export type Round = {
  id: string;
  gameId: string;
  createdAt: Date;
  endedAt?: Date;
  betPhase: boolean;
};
