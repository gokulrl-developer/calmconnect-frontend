export const PsychologistSpecialization = {
  ANXIETY_DISORDERS: "Anxiety Disorders",
  DEPRESSION: "Depression",
  PTSD: "PTSD",
  RELATIONSHIP_COUNSELING: "Relationship Counseling",
  CHILD_PSYCHOLOGY: "Child Psychology",
  ADDICTION_THERAPY: "Addiction Therapy",
  COGNITIVE_BEHAVIORAL_THERAPY: "Cognitive Behavioral Therapy",
  FAMILY_THERAPY: "Family Therapy",
  GRIEF_COUNSELING: "Grief Counseling",
  STRESS_MANAGEMENT: "Stress Management",
} as const;

export type PsychologistSpecialization =
  typeof PsychologistSpecialization[keyof typeof PsychologistSpecialization];
