export const UserGender = {
  MALE: "male",
  FEMALE: "female",
  OTHERS: "others",
} as const;

export type UserGender = typeof UserGender[keyof typeof UserGender];
