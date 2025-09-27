export interface AvailabilityRule{
    startTime:null|string,
    endTime:null|string,
    startDate:null|string,
    endDate:null|string,
    durationInMins:null|number,
    bufferTimeInMins:null|number,
    quickSlots:string[],
    slotsOpenTime:null|string,
    specialDays:{
        weekDay:number,
        availableSlots:string[]
    }[],
    quickSlotsReleaseWindowMins:null|number
}

export interface Slot{
    startTime:string,
    endTime:string,
    quick:boolean
}

export interface SpecialDay{
    weekDay:number,
    availableSlots:string[]
}

export interface QuickSlotReleaseDuration {
  days:number;
  hours: number;
  minutes: number;
}

export interface AvailabilityRuleSummary{
    availabilityRuleId:string,
    startDate:string,
    endDate:string
}
