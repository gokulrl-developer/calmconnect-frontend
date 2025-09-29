import type { Slot } from "../domain/AvailabiliityRule.types";

export interface ListPsychSummary{
  psychId: string;
  name: string;
  rating: number | null;
  specializations: string | null;
  hourlyFees: number | null;
  profilePicture: string | null;
  bio: string | null;
  qualifications: string | null;
}
export interface PsychDetails{
 availableSlots: Slot[];
  psychId: string;
  name: string;
  rating: number;
  specializations: string[];
  bio: string;
  qualifications: string;
  profilePicture: string;
  hourlyFees: number;
  quickSlotFees: number;
}