export interface PsychProfile{
profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female' | 'others';
    dob?: Date;
    profilePicture?: string;
    address?: string;
    languages?: string;
    specializations?: string[];
    bio?: string;
    qualifications?: string;
    hourlyFees?: number;
    quickSlotHourlyFees?: number;
  }
}


// ---------- Generic Response ----------
export interface MessageResponse {
  message: string;
}

// ---------- Availability Rules ----------
export interface AvailabilityRuleDetails {
  weekDay: number; // 0-6
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  durationInMins: number;
  bufferTimeInMins: number;
  status: "active" | "inactive";
  availabilityRuleId: string;
}

export interface AvailabilityRuleSummary {
  weekDay: number;
  availabilityRuleId: string;
}

// ---------- Special Days ----------
export interface SpecialDay {
  type: "override" | "absent";
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: "active" | "inactive";
  specialDayId: string;
}

// ---------- Quick Slots ----------
export interface QuickSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  durationInMins: number;
  bufferTimeInMins: number;
  status: "active" | "inactive";
  quickSlotId: string;
}

// ---------- Daily Availability ----------
export interface DailyAvailability {
  availabilityRule: AvailabilityRuleDetails;
  specialDay?: SpecialDay;
  quickSlots: QuickSlot[];
}

// ---------- Request Payloads ----------
export interface CreateAvailabilityRulePayload {
  weekDay: number;
  startTime: string;
  endTime: string;
  durationInMins: number;
  bufferTimeInMins?: number;
}

export interface EditAvailabilityRulePayload {
  startTime?: string;
  endTime?: string;
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: "active" | "inactive";
}

export interface CreateSpecialDayPayload {
  date: string; // ISO date
  type: "override" | "absent";
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
}

export interface EditSpecialDayPayload {
  type?: "override" | "absent";
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: "active" | "inactive";
}

export interface CreateQuickSlotPayload {
  date: string; // ISO date
  startTime: string;  // ISO string
  endTime: string;    // ISO string
  durationInMins: number;
  bufferTimeInMins?: number;
}

export interface EditQuickSlotPayload {
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: "active" | "inactive";
}

export interface FetchDailyAvailabilityPayload {
  date: string; // ISO date
}
