import type { AvailabilityRuleStatus } from "../../constants/availability-rule.status";
import type { PsychologistGender } from "../../constants/psychologist-gender";
import type { SpecialDayStatus } from "../../constants/SpecialDayStatus";
import type { SpecialDayType } from "../../constants/SpecialDayType";
import type { Slot } from "../domain/AvailabiliityRule.types";

export interface PsychProfile{
profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: PsychologistGender;
    dob?: Date;
    profilePicture?: string | File;
    address?: string;
    languages?: string;
    specializations?: string[];
    bio?: string;
    qualifications?: string;
    hourlyFees?: number;
  }
}

export interface CreateAvailabilityRule {
  weekDay: number;
  startTime: string;
  endTime: string;
  durationInMins: number;
  bufferTimeInMins?: number;
}

export interface CurrentAvailabilityRule {
  availabilityRuleId:string,
  startTime?: string;
  endTime?: string;
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: AvailabilityRuleStatus;
}

export interface CurrentSpecialDay {
  type: SpecialDayType;
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: SpecialDayStatus;
  specialDayId: string;
}

export interface CreateSpecialDay {
  type:SpecialDayType;
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
}

export interface CurrentQuickSlot {
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  quickSlotId?: string;
}

export interface RenderedQuickSlot{
  quickSlotId:string,
  slots:Slot[]
}

export interface ProfileErrors{
    firstName?: string;
    lastName?: string;
    gender?: string;
    dob?: string;
    profilePicture?: string;
    address?: string;
    languages?: string;
    specializations?: string;
    bio?: string;
    qualifications?: string;
    hourlyFees?: string;
  }