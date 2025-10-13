


//////////////////////////////////////////////
export interface Slot{
    startTime:string,
    endTime:string,
}

export interface Availability{
    startTime:string,   // ISO string or HH:MM string
    endTime:string,     // ISO string or HH:MM string
    durationInMins:number,
    bufferTimeInMins?:number
}