export const PsychReviewsSortByUser = {
  RECENT: "recent",
  TOP_RATED: "top-rated",
} as const;

export type PsychReviewsSortByUser = 
  typeof PsychReviewsSortByUser[keyof typeof PsychReviewsSortByUser];
