export const ListPsychByUserSort = {
  A_Z: "a-z",
  Z_A: "z-a",
  RATING: "rating",
  PRICE: "price",
} as const;

export type ListPsychByUserSort =
  typeof ListPsychByUserSort[keyof typeof ListPsychByUserSort];
