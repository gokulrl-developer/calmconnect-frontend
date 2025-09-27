import React, { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal";
import Card from "../../components/UI/Card";
import type {
  AvailabilityRule,
  Slot,
  SpecialDay,
} from "../../types/domain/AvailabiliityRule.types";
import { produce } from "immer";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import type { QuickSlotReleaseDuration } from "../../types/domain/AvailabiliityRule.types";
import { createAvailabilityRule } from "../../services/psychologistService";
import { toast } from "sonner";
//import { WeekdayModel } from "../../components/Week"; // Use your weekday model

const weekdays = [
  { key: "0", label: "Monday" },
  { key: "1", label: "Tuesday" },
  { key: "2", label: "Wednesday" },
  { key: "3", label: "Thursday" },
  { key: "4", label: "Friday" },
  { key: "5", label: "Saturday" },
  { key: "6", label: "Sunday" },
];
export default function CreateRule() {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [availabilityRuleModal, setAvailabilityRuleModal] = useState(false);
  const [dailySlots, setDailySlots] = useState<string[]>([]);
  const [showWeekDaySlots, setShowWeekDaySlots] = useState(false);
  const [showNormalDaySlots, setShowNormalDaySlots] = useState(false);
  const [selectedWeekDay, setSelectedWeekDay] = useState<null | number>(null);
  const [availabilityRuleFlag, setAvailabilityRuleFlag] = useState(false);
  const [availabilityRule, setAvailabilityRule] = useState<AvailabilityRule>({
    startTime: null,
    endTime: null,
    startDate: null,
    endDate: null,
    durationInMins: null,
    bufferTimeInMins: null,
    quickSlots: [],
    slotsOpenTime: null,
    specialDays: [],
    quickSlotsReleaseWindowMins: null
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [normalSlotOpenTime, setNormalSlotOpenTime] = useState<null | Date>(
    null
  );

  const [quickSlotReleaseWindow, setQuickSlotReleaseWindow] =
    useState<QuickSlotReleaseDuration>({
      days: 0,
      hours: 0,
      minutes: 0,
    });
  useEffect(() => {
    createSlots();
  }, [
    availabilityRule,
    showNormalDaySlots,
    showWeekDaySlots,
    selectedWeekDay,
    availabilityRuleFlag,
  ]);
  function openAvailabilityRuleModal() {
    setErrors({});
    setAvailabilityRuleModal(true);
  }
  function timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
  function minutesToTimeString(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  function createSlots() {
    if (availabilityRuleFlag === false) {
      return;
    }
    const weekDay = selectedWeekDay;
    let isSpecialDay = false;
    if (
      weekDay !== null &&
      availabilityRule.specialDays.some(
        (day: SpecialDay) => day.weekDay === weekDay
      )
    ) {
      isSpecialDay = true;
    }
    if (isSpecialDay === true) {
      // logic for week day slot creation
      const availableSlots = availabilityRule.specialDays.filter(
        (day: SpecialDay) => day.weekDay === weekDay
      )[0].availableSlots;
      const { durationInMins } = availabilityRule;
      setSlots(
        availableSlots.map((slot: string) => {
          const startTimeMinutes = timeStringToMinutes(slot);
          const endTimeMinutes = startTimeMinutes + durationInMins!;

          const isQuickSlot = availabilityRule.quickSlots.some(
            (quickSlot: string) => quickSlot === slot
          );

          return {
            startTime: slot,
            endTime: minutesToTimeString(endTimeMinutes),
            quick: isQuickSlot,
          };
        })
      );
    } else {
      // logic for normal day slots creation

      const startTime = timeStringToMinutes(availabilityRule.startTime!);
      const endTime = timeStringToMinutes(availabilityRule.endTime!);
      let { bufferTimeInMins, durationInMins } = availabilityRule;
      bufferTimeInMins = bufferTimeInMins ? bufferTimeInMins : 0;
      let slots = []; // available Slots for a non-special day in availability rule
      let currTime = startTime;

      while (currTime <= endTime) {
        let currStartTime = currTime;
        currTime = currTime + durationInMins!;
        if (currTime < endTime) {
          let isQuickSlot = false;
          if (
            availabilityRule.quickSlots.some(
              (slot: string) => timeStringToMinutes(slot) === currStartTime
            )
          ) {
            isQuickSlot = true;
          }
          console.log("from create slots is quick", isQuickSlot);
          slots.push({
            startTime: minutesToTimeString(currStartTime),
            endTime: minutesToTimeString(currTime),
            quick: isQuickSlot,
          });
          currTime = currTime + bufferTimeInMins;
        }
      }
      setSlots(slots);
    }
  }

  function createAvailabilityState(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const durationInMins = Number(formData.get("durationInMins"));
    const bufferTimeInMins = Number(formData.get("bufferTimeInMins"));
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!startTime || startTime.trim().length === 0) {
      newErrors.startTime = "Please select start time";
    }

    if (!endTime || endTime.trim().length === 0) {
      newErrors.endTime = "Please select end time";
    }

    if (
      !durationInMins ||
      isNaN(durationInMins) ||
      durationInMins < 15 ||
      durationInMins > 180
    ) {
      newErrors.durationInMins =
        "Slot duration should be given and should be greater than 15-180 minutes range";
    }

    if (!bufferTimeInMins || isNaN(bufferTimeInMins)) {
      newErrors.bufferTimeInMins = "Buffer time is in invalid format";
    }
    setErrors(newErrors);
    setAvailabilityRule({
      ...availabilityRule,
      startTime,
      endTime,
      durationInMins,
      bufferTimeInMins,
    });
    setAvailabilityRuleFlag(true);
    setShowNormalDaySlots(true);
    setAvailabilityRuleModal(false);
  }

  const handleWeekdayClick = (key: string) => {
    setShowNormalDaySlots(false);
    setSelectedWeekDay(Number(key));
    setShowWeekDaySlots(true);
  };

  function handleNormalDayClick() {
    setShowWeekDaySlots(false);
    setShowNormalDaySlots(true);
  }

  function toggleAsQuickSlot(startTime: string) {
    setAvailabilityRule((availabilityRule) =>
      produce(availabilityRule, (draft) => {
        draft.quickSlots = draft.quickSlots ?? [];
        if (!draft.quickSlots.includes(startTime)) {
          draft.quickSlots.push(startTime);
        } else {
          const index = draft.quickSlots.findIndex(
            (slot) => slot === startTime
          );
          if (index !== -1) draft.quickSlots.splice(index, 1);
        }
      })
    );
  }

  function handleSlotDeletion(startTime: string) {
    setAvailabilityRule((availabilityRule) =>
      produce(availabilityRule, (draft) => {
        const weekDay = selectedWeekDay;
        let specialDay = draft.specialDays.find(
          (day: SpecialDay) => day.weekDay === weekDay
        );
        const slotStrings = slots
          .filter((slot: Slot) => slot.startTime !== startTime)
          .map((slot: Slot) => slot.startTime);
        if (!specialDay) {
          specialDay = {
            weekDay: weekDay!,
            availableSlots: slotStrings,
          };
          draft.specialDays.push(specialDay);
        } else {
          specialDay.availableSlots = slotStrings;
        }
      })
    );
  }

  function markCompleteHoliday() {
    const weekDay = selectedWeekDay;
    setAvailabilityRule((availabilityRule) =>
      produce(availabilityRule, (draft) => {
        const specialDay = draft.specialDays.find(
          (day: SpecialDay) => day.weekDay === weekDay
        );
        if (specialDay) {
          specialDay.availableSlots.length = 0;
        } else {
          draft.specialDays.push({
            weekDay: weekDay!,
            availableSlots: [],
          });
        }
      })
    );
  }

  function markAsNormalDay() {
    const weekDay = selectedWeekDay;
    setAvailabilityRule(
      produce(availabilityRule, (draft) => {
        draft.specialDays = draft.specialDays.filter(
          (day: SpecialDay) => day.weekDay !== weekDay
        );
      })
    );
  }

  async function submitAvailabilityRule() {
    const rule = availabilityRule;
    const newErrors: Record<string, string> = {};

    if (!rule.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!rule.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (!rule.startDate) {
      newErrors.startTime = "Start time is required";
    }
    if (!rule.endDate) {
      newErrors.endTime = "End time is required";
    }

    if (
      !rule.durationInMins ||
      isNaN(rule.durationInMins) ||
      rule.durationInMins < 15 ||
      rule.durationInMins > 180
    ) {
      newErrors.durationInMins =
        "Slot duration must be between 15 and 180 minutes";
    }

    if (rule.bufferTimeInMins === null || isNaN(rule.bufferTimeInMins!)) {
      newErrors.bufferTimeInMins = "Buffer time is invalid";
    }

    if (!normalSlotOpenTime) {
      newErrors.normalSlotOpenTime = "Please select Normal Slots opening time";
    }

    if (
      quickSlotReleaseWindow.days === 0 &&
      quickSlotReleaseWindow.hours === 0 &&
      quickSlotReleaseWindow.minutes === 0
    ) {
      newErrors.quickSlotReleaseWindow =
        "Quick slot release duration must be greater than 0 minutes";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix validation errors before saving");
      return;
    }

    const finalRule = {
      ...rule,
      startDate:new Date(availabilityRule.startDate!).toISOString(),
      endDate:new Date(availabilityRule.endDate!).toISOString(),
      slotsOpenTime: normalSlotOpenTime!.toISOString(),
      quickSlotsReleaseWindowMins:
        quickSlotReleaseWindow.days * 24 * 60 +
        quickSlotReleaseWindow.hours * 60 +
        quickSlotReleaseWindow.minutes,
    };

    try {
      const res = await createAvailabilityRule(finalRule);
      if (res.data) {
        toast("Availability rule created successfully");
        
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <Card className="max-w-3xl mx-auto p-8 space-y-8 flex flex-col">
        <h1 className="text-center font-bold text-xl">SET AVAILABILITY</h1>
        <button
          className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:shadow-xl my-3"
          onClick={() => openAvailabilityRuleModal()}
        >
          CREATE SLOTS
        </button>

        <section>
          <section className="flex flex-row items-center">
            {/* Button for showing  Normal day slots */}
            <button
              className="bg-violet-900 hover:bg-secondary-1000 text-white rounded-lg px-4 py-2 font-medium shadow hover:shadow-xl"
              onClick={() => handleNormalDayClick()}
            >
              NORMAL DAY SLOTS
            </button>
            <label className="block  text-black dark:text-primary-200 ml-3">
              <span className="text-md">
                Mark Quick Slots From Normal Day Slots
              </span>
            </label>
          </section>
          {/* Select Weekdays for Marking partial or complete absent weekdays */}
          <section>
            <label className="block  text-black dark:text-primary-200 mb-3">
              <span className="text-lg font-semibold mb-2">
                MARK HOLIDAYS :{" "}
              </span>
              <span className="text-md">
                Mark partial or complete absent week days by selecting from
                below
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day, idx) => (
                <button
                  key={day.key}
                  type="button"
                  className={`flex-1 min-w-[60px] h-12 flex flex-col items-center justify-center rounded-lg font-medium border
          ${
            selectedWeekdays.includes(day.key)
              ? "bg-primary-500 text-white border-primary-600 shadow pulse-glow"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
          }
          hover:scale-[1.02] transition-all duration-300`}
                  onClick={() => handleWeekdayClick(day.key)}
                >
                  <span className="text-xs">{day.label}</span>
                </button>
              ))}
            </div>
          </section>
        </section>
        {/* Slots Section */}
        <section>
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Slots
          </h3>
          <section>
            {showWeekDaySlots && availabilityRule?.startTime && (
              <button
                className="bg-green-500 m-2 p-1"
                onClick={() => {
                  markAsNormalDay();
                }}
              >
                MARK AS NORMAL DAY
              </button>
            )}
            {showWeekDaySlots && slots.length > 0 && (
              <button
                className="bg-red-500 m-2 p-1"
                onClick={() => {
                  markCompleteHoliday();
                }}
              >
                MARK AS COMPLETE ABSENT
              </button>
            )}
          </section>
          <div className="flex flex-wrap justify-between">
            {slots.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No slots created yet
              </p>
            ) : (
              slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={
                    slot.quick === true
                      ? "flex bg-yellow-300 border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer"
                      : "flex bg-green-100 border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer"
                  }
                  onClick={
                    showNormalDaySlots
                      ? () => toggleAsQuickSlot(slot.startTime)
                      : () => {}
                  }
                >
                  <div className="flex flex-col font-mono">
                    <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-200">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  {showWeekDaySlots && (
                    <div className="flex gap-2">
                      {/* Delete Slot Button */}
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
                        title="Delete Slot"
                        onClick={() => handleSlotDeletion(slot.startTime)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 8a1 1 0 011 1v6a1 1 0 102 0V9a1 1 0 112 0v6a1 1 0 102 0V9a1 1 0 011-1h1V6H5v2h1zM4 5h12v1H4V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Start date and end date */}

        <section className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <DatePicker
              value={availabilityRule.startDate}
              onChange={(value) => {
                if (!Array.isArray(value)) {
                  setAvailabilityRule((prev) => ({
                    ...prev,
                    startDate: value ? value.toISOString().split("T")[0] : null,
                  }));
                }
              }}
              format="y-MM-dd"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">End Date</label>
            <DatePicker
              value={availabilityRule.endDate}
              onChange={(value) => {
                if (!Array.isArray(value)) {
                  setAvailabilityRule((prev) => ({
                    ...prev,
                    endDate: value ? value.toISOString().split("T")[0] : null,
                  }));
                }
              }}
              format="y-MM-dd"
            />
          </div>
        </section>
        {/* Opening Times Section */}
        <section>
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Opening Times
          </h3>
          <div className="grid grid-rows-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                Normal Slots Opening Time
              </label>
              <DateTimePicker
                onChange={setNormalSlotOpenTime}
                value={normalSlotOpenTime ?? undefined}
                disableClock={false} // show clock for time picking
                format="y-MM-dd h:mm a"
                locale="en-US"
                minDate={new Date()} // prevent past dates
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Quick Slots Release Time
              </label>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="flex flex-col">
                  <label className="block text-sm mb-1">Days</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                    value={quickSlotReleaseWindow.days}
                    onChange={(e) =>
                      setQuickSlotReleaseWindow(
                        produce(quickSlotReleaseWindow, (draft) => {
                          draft.days = Math.max(
                            0,
                            parseInt(e.target.value) || 0
                          );
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm mb-1">Hours</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                    value={quickSlotReleaseWindow.hours}
                    onChange={(e) =>
                      setQuickSlotReleaseWindow(
                        produce(quickSlotReleaseWindow, (draft) => {
                          draft.hours = Math.min(
                            23,
                            Math.max(0, parseInt(e.target.value) || 0)
                          );
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm mb-1">Minutes</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                    value={quickSlotReleaseWindow.minutes}
                    onChange={(e) =>
                      setQuickSlotReleaseWindow(
                        produce(quickSlotReleaseWindow, (draft) => {
                          draft.minutes = Math.min(
                            59,
                            Math.max(0, parseInt(e.target.value) || 0)
                          );
                        })
                      )
                    }
                  />
                </div>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Selected duration: {quickSlotReleaseWindow.days}d{" "}
                {quickSlotReleaseWindow.hours}h {quickSlotReleaseWindow.minutes}
                m
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 pt-4">
          <button className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-4 py-2">
            Cancel
          </button>
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 font-semibold"
            onClick={() => submitAvailabilityRule()}
          >
            Save Rule
          </button>
        </div>
      </Card>

      {/* Create Slots Modal */}
      {availabilityRuleModal && (
        <Modal
          onClose={() => setAvailabilityRuleModal(false)}
          title="Create Slots"
          isOpen={availabilityRuleModal}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4"></h3>
            <form
              onSubmit={(e) => createAvailabilityState(e)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  name="startTime"
                  type="time"
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input
                  name="endTime"
                  type="time"
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Duration (minutes)</label>
                <input
                  name="durationInMins"
                  type="number"
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                />
                {errors.durationInMins && (
                  <p className="text-red-500 text-sm">
                    {errors.durationInMins}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Buffer Time (minutes)
                </label>
                <input
                  name="bufferTimeInMins"
                  type="number"
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700"
                />
                {errors.bufferTimeInMins && (
                  <p className="text-red-500 text-sm">
                    {errors.bufferTimeInMins}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-4 py-2"
                  onClick={() => setAvailabilityRuleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 font-semibold"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
