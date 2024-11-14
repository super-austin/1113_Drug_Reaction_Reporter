export interface DrugReaction {
  term: string;
  count: number;
}

export interface FDAResponse {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
  };
  results: DrugReaction[];
}

export interface ApiResponse {
  reactions: {
    term: string;
    count: number;
  }[];
  totalResults: number;
}
