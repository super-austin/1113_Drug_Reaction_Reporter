export const MOCK_REACTIONS_LIST: {
  [key: string]: { term: string; count: number }[];
} = {
  Tylenol: [
    {
      term: "DRUG INEFFECTIVE",
      count: 32400,
    },
    {
      term: "FATIGUE",
      count: 30587,
    },
    {
      term: "OFF LABEL USE",
      count: 27744,
    },
    {
      term: "NAUSEA",
      count: 26255,
    },
    {
      term: "PAIN",
      count: 26127,
    },
  ],
  Vimizim: [
    {
      term: "PYREXIA",
      count: 624,
    },
    {
      term: "VOMITING",
      count: 285,
    },
    {
      term: "COUGH",
      count: 277,
    },
    {
      term: "MALAISE",
      count: 258,
    },
    {
      term: "HEADACHE",
      count: 230,
    },
  ],
};
