import React from "react";
import type { Slot } from "../../types/domain/AvailabiliityRule.types";



interface SlotGridProps {
  availableSlots: Slot[];
  onSlotClick: (startTime: string) => void;
  emptyText?: string;
}

const SlotGrid: React.FC<SlotGridProps> = ({
  availableSlots,
  onSlotClick=()=>{},
  emptyText = "No slots available for this date",
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.length > 0 ? (
        availableSlots.map((slot) => (
          <button
            key={slot.startTime}
            onClick={() => onSlotClick(slot.startTime)}
            className="p-2 text-sm border border-border rounded-lg transition-colors hover:border-primary hover:bg-primary/10"            
          >
            {slot.startTime} - {slot.endTime}
          </button>
        ))
      ) : (
        <div className="col-span-3 text-center py-4 text-muted-foreground text-sm">
          {emptyText}
        </div>
      )}
    </div>
  );
};

export default SlotGrid;
