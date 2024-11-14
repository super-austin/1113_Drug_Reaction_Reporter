export interface DrugReaction {
  term: string;
  count: number;
}

export interface FDAResult {
  patient: {
    reaction: Array<{
      reactionmeddrapt: string;
      reactionoutcome?: string;
    }>;
  };
}

export interface FDAResponse {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      total: number;
    };
  };
  results: FDAResult[];
}

export interface ApiResponse {
  reactions: DrugReaction[];
  meta: {
    disclaimer: string;
    lastUpdated: string;
    total: number;
  };
  nextPageUrl: string | null;
}
