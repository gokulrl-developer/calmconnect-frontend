export const PsychologistStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type PsychologistStatus = 
  typeof PsychologistStatus[keyof typeof PsychologistStatus];
