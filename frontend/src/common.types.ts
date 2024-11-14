export interface Reaction {
  term: string;
  count: number;
}

export interface ApiResponse {
  reactions: Reaction[];
  totalResults: number;
}
