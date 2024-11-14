export interface Reaction {
  term: string;
  count: number;
}

export interface ApiResponse {
  reactions: Reaction[];
  meta: {
    disclaimer: string;
    lastUpdated: string;
    total: number;
  };
  nextPageUrl: string | null;
}
