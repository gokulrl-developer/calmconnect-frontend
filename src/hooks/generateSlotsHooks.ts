import type { Availability, Slot } from "../types/domain/AvailabiliityRule.types";

export const useGenerateSlots = (availability: Availability | null): Slot[] => {
  if (!availability) return [];

  
  const { startTime, endTime, durationInMins} = availability;
  let bufferTimeInMins;
  bufferTimeInMins=availability.bufferTimeInMins;
  if(!bufferTimeInMins){
    bufferTimeInMins=0;
  }

  const parseTime = (timeStr: string): Date => {
    const isISO = timeStr.includes("T");
    if (isISO) return new Date(timeStr);

    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const formatTime = (d: Date): string => d.toTimeString().slice(0, 5);

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const result: Slot[] = [];
  let current = new Date(start);

  while (current.getTime() + durationInMins * 60000 <= end.getTime()) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + durationInMins * 60000);

    result.push({
      startTime: formatTime(slotStart),
      endTime: formatTime(slotEnd),
    });

    current = new Date(current.getTime() + (durationInMins + bufferTimeInMins) * 60000);
  }

  return result;
};
