import type { AxiosResponse } from "axios";

import type { FDAResult, DrugReaction } from "./common.types";

export const extractNextPageUrl = (response: AxiosResponse): string | null => {
  const linkHeader = response.headers["link"];
  if (!linkHeader) return null;

  const matches = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return matches ? matches[1] : null;
};

export const aggregateReactions = (results: FDAResult[]): DrugReaction[] => {
  const reactionCounts = new Map<string, number>();

  results.forEach((result) => {
    result.patient.reaction.forEach((reaction) => {
      const term = reaction.reactionmeddrapt;
      reactionCounts.set(
        term,
        (reactionCounts.get(term) || 0) +
          (reaction.reactionoutcome ? Number(reaction.reactionoutcome) : 1)
      );
    });
  });

  return Array.from(reactionCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count);
};
