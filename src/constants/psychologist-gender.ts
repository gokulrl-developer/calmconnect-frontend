export const PsychologistGender = {
  MALE: "male",
  FEMALE: "female",
  OTHERS: "others",
} as const;

export type PsychologistGender =
  typeof PsychologistGender[keyof typeof PsychologistGender];
