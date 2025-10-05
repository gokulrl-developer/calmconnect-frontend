import React, { useEffect, useState } from "react";
import Calendar from "../../components/UI/Calendar"; // Use your calendar model
import type {
  AvailabilityRule,
  AvailabilityRuleSummary,
  Slot,
  SpecialDay,
} from "../../types/domain/AvailabiliityRule.types";
import {
  deleteHoliday,
  deleteRule,
  fetchAvailabilityRuleDetails,
  fetchAvailabilityRuleSummaries,
  fetchDailyAvailability,
  markHoliday,
} from "../../services/psychologistService";
import Modal from "../../components/UI/Modal";
import { produce } from "immer";
import { toast } from "sonner";
import Button from "../../components/UI/Button";
import { EyeIcon } from "lucide-react";

const weekdays = [
  { key: "0", label: "Sunday" },
  { key: "1", label: "Monday" },
  { key: "2", label: "Tuesday" },
  { key: "3", label: "Wednesday" },
  { key: "4", label: "Thursday" },
  { key: "5", label: "Friday" },
  { key: "6", label: "Saturday" },
];

export default function Availability() {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [renderSlots, setRenderSlots] = useState<{
    selectedDate: null | Date;
    showSlotsModal: boolean;
  }>({ selectedDate: null, showSlotsModal: false });
  const [ruleSummaries, setRuleSummaries] = useState<AvailabilityRuleSummary[]>(
    []
  );
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
    quickSlotsReleaseWindowMins: null,
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedWeekDay, setSelectedWeekDay] = useState<null | number>(null);
  const [showWeekDaySlots, setShowWeekDaySlots] = useState(false);
  const [showNormalDaySlots, setShowNormalDaySlots] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  useEffect(() => {
    fetchAvailableSlots();
  }, [renderSlots]);

  useEffect(() => {
    fetchRuleSummaries();
  }, []);

  useEffect(() => {
    createSlots();
  }, [availabilityRule, showNormalDaySlots, showWeekDaySlots, selectedWeekDay]);

  async function fetchRuleSummaries() {
    try {
      const result = await fetchAvailabilityRuleSummaries();
      if (result.data) {
        setRuleSummaries([...result.data.summaries]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAvailableSlots() {
    try {
      if (!renderSlots.selectedDate) {
        return;
      }
      const dateString = renderSlots.selectedDate.toISOString();
      const result = await fetchDailyAvailability(dateString);
      if (result.data) {
        console.log(result.data)
        setAvailableSlots(result.data.availableSlots);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDateSelection(day: Date) {
    setRenderSlots(
      produce(renderSlots, (draft) => {
        draft.selectedDate = day;
        draft.showSlotsModal = true;
      })
    );
  }

  function markCompleteHoliday() {
    setAvailableSlots(
      produce(availableSlots, (draft) => {
        draft.length = 0;
      })
    );
    setShowSaveButton(true);
  }

  async function markAsNormalDay() {
    const date = renderSlots.selectedDate;
    try {
      const result = await deleteHoliday(date!.toISOString());
      if (result.data) {
        await fetchAvailableSlots();
        setShowSaveButton(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleSlotDeletion(startTime: string) {
    setAvailableSlots(
      produce(availableSlots, (draft) => {
        return draft.filter((slot: Slot) => slot.startTime !== startTime);
      })
    );
    setShowSaveButton(true);
  }

  async function handleSaveSlots() {
    try {
      let slots = availableSlots.map((slot: Slot) => slot.startTime);
      let date = renderSlots.selectedDate!.toISOString();
      const result = await markHoliday({
        availableSlots: slots,
        date,
      });

      if (result.data) {
        toast("Holiday Marked Successfully");
        await fetchAvailableSlots();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAvailabilityRule(ruleId: string) {
    try {
      const result = await deleteRule(ruleId);
      if (result.data) {
        toast("Availability rule deleted successfully");
        fetchRuleSummaries();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAvailabilityRule(ruleId: string) {
    try {
      const result = await fetchAvailabilityRuleDetails(ruleId);
      if (result.data) {
        setAvailabilityRule(result.data.availabilityRule);
        setShowRuleModal(true);
      }
    } catch (error) {
      console.log(error);
    }
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
    if (availabilityRule.startTime === null) {
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

  const handleWeekdayClick = (key: string) => {
    setShowNormalDaySlots(false);
    setSelectedWeekDay(Number(key));
    setShowWeekDaySlots(true);
  };

  function handleNormalDayClick() {
    setShowWeekDaySlots(false);
    setShowNormalDaySlots(true);
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
        {/* Availability Exceptions */}
        <div className="items-center">
          <section className="glass-card p-6 animate-in w-max">
            <h2 className="text-xl font-semibold text-secondary-700 dark:text-secondary-200 mb-4">
              Set Availability Exceptions
            </h2>
            <Calendar onDateSelect={handleDateSelection} />
          </section>
        </div>
        {/* Rules List */}
        <section className="glass-card p-6 animate-in w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-200">
              Availability Rules
            </h2>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:shadow-xl"
              onClick={() =>
                (window.location.href = "/psychologist/create-rule")
              }
            >
              Create Rule
            </button>
          </div>
          <ul className="space-y-4">
            {ruleSummaries.length > 0 &&
              ruleSummaries.map((summary) => (
                <li
                  key={summary.availabilityRuleId}
                  className="glass-card p-4 flex items-center justify-between fade-in"
                >
                  <span className="text-gray-700 dark:text-gray-200">{`${
                    summary.startDate.split("T")[0]
                  } to ${summary.endDate.split("T")[0]}`}</span>
                  <div className="flex flex-cols gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        fetchAvailabilityRule(summary.availabilityRuleId)
                      }
                    >
                      <EyeIcon className="w-4 h-4 mr-1" /> View
                    </Button>

                    <Button
                      variant="warning"
                      onClick={() => {
                        deleteAvailabilityRule(summary.availabilityRuleId);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>

      {/* Daily Availability Modal */}
      <Modal
        isOpen={renderSlots.showSlotsModal}
        onClose={() => {
          setRenderSlots(
            produce(renderSlots, (draft) => {
              draft.selectedDate = null;
              draft.showSlotsModal = false;
            })
          );
          setAvailableSlots([]);
          setAvailabilityRule({
            startTime: null,
            endTime: null,
            startDate: null,
            endDate: null,
            durationInMins: null,
            bufferTimeInMins: null,
            quickSlots: [],
            slotsOpenTime: null,
            specialDays: [],
            quickSlotsReleaseWindowMins: null,
          });
        }}
        title="Available Slots In The Day"
      >
        <section className="m-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Slots
          </h3>
          <section>
            <button
              className="bg-green-500 m-2 p-1"
              onClick={() => {
                markAsNormalDay();
              }}
            >
              MARK AS NORMAL DAY
            </button>
            {availableSlots.length > 0 && (
              <button
                className="bg-red-500 m-2 p-1"
                onClick={() => {
                  markCompleteHoliday();
                }}
              >
                MARK AS COMPLETE ABSENT
              </button>
            )}
            {showSaveButton === true && (
              <button
                className="bg-red-500 m-2 p-1"
                onClick={() => {
                  handleSaveSlots();
                }}
              >
                SAVE CHANGES
              </button>
            )}
          </section>
          <div className="flex flex-wrap justify-between">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-lg px-4 py-2 shadow-sm border transition cursor-pointer
        ${
          slot.quick
            ? "bg-yellow-100 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-300/20 dark:border-yellow-500 dark:hover:bg-yellow-300/30"
            : "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-800/30 dark:border-green-600 dark:hover:bg-green-800/50"
        }`}
                >
                  {/* Slot Time */}
                  <div className="flex flex-col font-mono flex-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <div className="flex items-center gap-2">
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
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic text-sm">
                No slots created
              </div>
            )}
          </div>
        </section>
      </Modal>

      {/* Availability Rule Details Modal */}
      <Modal
        isOpen={showRuleModal}
        onClose={() => {
          setAvailabilityRule({
            startTime: null,
            endTime: null,
            startDate: null,
            endDate: null,
            durationInMins: null,
            bufferTimeInMins: null,
            quickSlots: [],
            slotsOpenTime: null,
            specialDays: [],
            quickSlotsReleaseWindowMins: null,
          });
          setShowRuleModal(false);
        }}
        title="Availability Rule Shown as Slots"
      >
        <section>
          <section className="flex flex-row items-center">
            {/* Button for showing  Normal day slots */}
            <button
              className="bg-violet-900 hover:bg-secondary-1000 text-white rounded-lg px-4 py-2 font-medium shadow hover:shadow-xl"
              onClick={() => handleNormalDayClick()}
            >
              NORMAL DAY SLOTS
            </button>
          </section>

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
        {/* Slots Section */}
        <section className="m-5">
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Slots
          </h3>
          <div className="flex flex-wrap justify-between">
            {slots.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No slots created yet
              </p>
            ) : (
              slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded-lg px-4 py-2 shadow-sm border transition 
        ${
          slot.quick
            ? "bg-yellow-100 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-300/20 dark:border-yellow-500 dark:hover:bg-yellow-300/30"
            : "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-800/30 dark:border-green-600 dark:hover:bg-green-800/50"
        }`}
                >
                  <div className="flex flex-col font-mono">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </Modal>
    </div>
  );
}
