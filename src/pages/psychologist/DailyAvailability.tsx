import { useEffect, useState } from "react";
import type {
  AvailabilityRuleDetails,
  SpecialDay,
  QuickSlot,
  CreateSpecialDayPayload,
  EditSpecialDayPayload,
  CreateQuickSlotPayload,
  EditQuickSlotPayload,
} from "../../types/api/psychologist.types";
import type {
  CurrentSpecialDay,
  CurrentQuickSlot,
  RenderedQuickSlot,
} from "../../types/components/psychologist.types";
import {
  createQuickSlotAPI,
  createSpecialDay,
  deleteQuickSlotAPI,
  deleteSpecialDay,
  editQuickSlotAPI,
  editSpecialDay,
  fetchDailyAvailabilityAPI,
} from "../../services/psychologistService";
import { useGenerateSlots } from "../../hooks/generateSlotsHooks";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { useNavigate } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { Slot } from "../../types/domain/AvailabiliityRule.types";
import SlotGrid from "../../components/UI/SlotGrid";
import Modal from "../../components/UI/Modal";
import { toast } from "sonner";

export default function DailyAvailability() {
  const [availabilityRules, setAvailabilityRule] =
    useState<AvailabilityRuleDetails[]>([] as AvailabilityRuleDetails[]);
  const [originalSpecialDay, setOriginalSpecialDay] = useState<SpecialDay>(
    {} as SpecialDay
  );
  const [currentSpecialDay, setCurrentSpecialDay] = useState<CurrentSpecialDay>(
    {} as CurrentSpecialDay
  );
  const [specialDaySlots, setSpecialDaySlots] = useState<Slot[]>([]);
  const [availabilityRuleSlots, setAvailabilityRuleSlots] = useState<Slot[]>(
    []
  );
  const [originalQuickSlots, setOriginalQuickSlots] = useState<QuickSlot[]>([]);
  const [currentQuickSlot, setCurrentQuickSlot] = useState<CurrentQuickSlot>(
    {} as CurrentQuickSlot
  );
  const [renderedQuickSlots, setRenderedQuickSlots] = useState<
    RenderedQuickSlot[]
  >([]);
  const [showSpecialDayModal, setShowSpecialDayModal] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDeleteSpecialDay, setShowDeleteSpecialDay] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [editSpecialDayModal, setEditSpecialDayModal] = useState(false);
  const [showCreateQuickSlotModal, setShowCreateQuickSlotModal] =
    useState(false);
  const [showQuickSlotConfirmation, setShowQuickSlotConfirmation] =
    useState(false);
  const [quickSlotErrors,setQuickSlotErrors]=useState<Record<string,string>>({})
  const [editQuickSlotModal,setEditQuickSlotModal]=useState(false);
  const [editQuickSlotConfirmation,setEditQuickSlotConfirmation]=useState(false);
  const [showDeleteQuickSlot,setShowDeleteQuickSlot]=useState(false);
  const [deleteQuickSlotId,setDeleteQuickSlotId]=useState<null|string>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const dateFromUrl = new URLSearchParams(window.location.search).get("date");
    if (dateFromUrl) {
      setDate(new Date(dateFromUrl));
    }
  }, []);

  useEffect(() => {
    if (!date) return;

    fetchDailyAvailability(date);
  }, [date]);

  async function fetchDailyAvailability(selectedDate: Date) {
    try {
      const result = await fetchDailyAvailabilityAPI({
        date: selectedDate.toISOString(),
      });

      if (result.data) {
        const { availabilityRules, specialDay, quickSlots } = result.data;
        setAvailabilityRule(availabilityRules);
        if (specialDay) {
          setOriginalSpecialDay(specialDay);
          setCurrentSpecialDay(specialDay);
        }
        if (quickSlots) {
          setOriginalQuickSlots(quickSlots);
        }

        if (specialDay && specialDay.type === "override") {
          const slots = useGenerateSlots({
            startTime: specialDay.startTime!,
            endTime: specialDay.endTime!,
            durationInMins: specialDay.durationInMins!,
            bufferTimeInMins: specialDay.bufferTimeInMins,
          });
          setSpecialDaySlots(slots);
        } else if (availabilityRules.length>0) {
          let slots:Slot[]=[];
          for(const availabilityRule of availabilityRules){
            const availabilityRuleSlots = useGenerateSlots({
              startTime: availabilityRule.startTime,
              endTime: availabilityRule.endTime,
              durationInMins: availabilityRule.durationInMins,
              bufferTimeInMins: availabilityRule.bufferTimeInMins,
            });
            slots=[...availabilityRuleSlots]
          }
          setAvailabilityRuleSlots(slots);
        }

        if (quickSlots?.length > 0) {
          const rendered = quickSlots.map((qs) => ({
            quickSlotId: qs.quickSlotId,
            slots: useGenerateSlots({
              startTime: qs.startTime,
              endTime: qs.endTime,
              durationInMins: qs.durationInMins,
              bufferTimeInMins: qs.bufferTimeInMins,
            }),
          }));
          setRenderedQuickSlots(rendered);
        }
      }
    } catch (err) {
      console.error("Error fetching daily availability:", err);
    }
  }

  function HHMMToIso(hhmm: string, date: Date): string {
    const [hours, minutes] = hhmm.split(":").map(Number);
    const isoDate = new Date(date);
    isoDate.setHours(hours, minutes, 0, 0);
    return isoDate.toISOString();
  }

  function isoToHHMM(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  async function handleSpecialDayCreation() {
    if (!date || !currentSpecialDay) return;
    try {
      const payload: CreateSpecialDayPayload = {
        date: date.toISOString(),
        type: currentSpecialDay.type,
      };
     if(currentSpecialDay.type==="override"){
      payload.startTime = HHMMToIso(currentSpecialDay.startTime!, date);
      payload.endTime = HHMMToIso(currentSpecialDay.endTime!, date);
      payload.durationInMins = currentSpecialDay.durationInMins;
      payload.bufferTimeInMins = currentSpecialDay.bufferTimeInMins;
     }
      const result = await createSpecialDay(payload);

      if (result.data) {
        await fetchDailyAvailability(date);
        setShowEditConfirmation(false);
        setShowSpecialDayModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function handleSpecialDayEdit() {
    if (!date || !currentSpecialDay) return;
    try {
      const payload: EditSpecialDayPayload = {
        type: currentSpecialDay.type,
      };

      // Include only fields that differ from originalSpecialDay
      if (originalSpecialDay.startTime !== currentSpecialDay.startTime)
        payload.startTime = HHMMToIso(currentSpecialDay.startTime!, date);
      if (originalSpecialDay.endTime !== currentSpecialDay.endTime)
        payload.endTime = HHMMToIso(currentSpecialDay.endTime!, date);
      if (
        originalSpecialDay.durationInMins !== currentSpecialDay.durationInMins
      )
        payload.durationInMins = currentSpecialDay.durationInMins;
      if (
        originalSpecialDay.bufferTimeInMins !==
        currentSpecialDay.bufferTimeInMins
      )
        payload.bufferTimeInMins = currentSpecialDay.bufferTimeInMins;

      const result = await editSpecialDay(
        originalSpecialDay.specialDayId,
        payload
      );

      if (result.data) {
        await fetchDailyAvailability(date);
        setShowEditConfirmation(false);
        setEditSpecialDayModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSpecialDayDeletion() {
    try {
      const result = await deleteSpecialDay(originalSpecialDay.specialDayId);

      if (result.data) {
        toast.success(
          result.data.message || "The special day deleted successfully"
        );
        fetchDailyAvailability(date!);
        setShowDeleteSpecialDay(false);
        setOriginalSpecialDay({} as SpecialDay);
        setCurrentSpecialDay({} as CurrentSpecialDay);
      }
    } catch (error) {
      console.log(error);
      setShowDeleteSpecialDay(false);
    }
  }

 async function createQuickSlot() {
  const errors: Record<string, string> = {};
  setQuickSlotErrors({});
  if (!date) {
    toast.error("Date missing because of some internal error");
  }
  if (!currentQuickSlot.startTime) {
    errors.startTime = "Start time is required.";
  }
  if (!currentQuickSlot.endTime) {
    errors.endTime = "End time is required.";
  }
  if(new Date(currentQuickSlot.startTime!)>new Date(currentQuickSlot.endTime!)){
   errors.startTime="Start time can not be greater than end time"
  }
  if (!currentQuickSlot.durationInMins) {
    errors.duration = "Duration is required.";
  }

  if(currentQuickSlot.durationInMins!<20){
     errors.duration="Duration cannot be less than 20 minutes"
  }
  if(currentQuickSlot.bufferTimeInMins!<0){
     errors.buffer="Buffer time cannot be negative"
  }

  setQuickSlotErrors(errors);

  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    const payload: CreateQuickSlotPayload = {
      date: date!.toISOString(),
      startTime: currentQuickSlot.startTime!,
      endTime: currentQuickSlot.endTime!,
      durationInMins: currentQuickSlot.durationInMins!,
      bufferTimeInMins: currentQuickSlot.bufferTimeInMins,
    };

    const result = await createQuickSlotAPI(payload);

    if (result.data) {
      toast.success(result.data.message || "Quick slot created successfully");
      await fetchDailyAvailability(date!);
      setShowCreateQuickSlotModal(false);
      setShowQuickSlotConfirmation(false);
      setCurrentQuickSlot({} as CurrentQuickSlot);
    }
  } catch (err) {
    console.error(err);
  }
}

async function editQuickSlot(){
   const errors: Record<string, string> = {};
   setQuickSlotErrors({});
  if (!date) {
    toast.error("Date missing because of some internal error");
  }
  
  const selectedOriginalQuickSlot=originalQuickSlots.find((quickSlot:QuickSlot)=>quickSlot.quickSlotId===currentQuickSlot.quickSlotId);
 
  const payload: EditQuickSlotPayload = {};

if (currentQuickSlot.startTime !== selectedOriginalQuickSlot!.startTime)
  payload.startTime = currentQuickSlot.startTime;

if (currentQuickSlot.endTime !== selectedOriginalQuickSlot!.endTime)
  payload.endTime = currentQuickSlot.endTime;
 
if(currentQuickSlot.durationInMins !== selectedOriginalQuickSlot!.durationInMins){
  payload.durationInMins=currentQuickSlot?.durationInMins
}
if (currentQuickSlot.bufferTimeInMins !== selectedOriginalQuickSlot!.bufferTimeInMins){
  payload.bufferTimeInMins=currentQuickSlot?.bufferTimeInMins
}
if ('startTime' in payload && !payload.startTime){
  errors.startTime = "Start time is required.";
}
if ('endTime' in payload && !payload.endTime){
  errors.endTime = "End time is required.";
}
if (
  'startTime' in payload &&
  'endTime' in payload &&
  new Date(payload.startTime!) >= new Date(payload.endTime!)
){
  errors.endTime = "End time must be after start time.";
}

if("durationInMins" in payload &&
  payload.durationInMins!<20
){
  errors.duration="Duration must be greater than or equal to 20 mins"
}
if("bufferTimeInMins" in payload &&
  payload.bufferTimeInMins!<0
){
  errors.bufferTime="Buffer time cannot be negative"
}
  setQuickSlotErrors(errors);
    console.log("the error and payload",errors,payload.bufferTimeInMins,currentQuickSlot,selectedOriginalQuickSlot)
  if (Object.keys(errors).length > 0) {
    return;
  }
try{
  const result=await editQuickSlotAPI(currentQuickSlot.quickSlotId!,payload);

  if(result.data){
    toast.success(result.data.message || "The quick slot was updated successfully.");
    setCurrentQuickSlot({});
    setEditQuickSlotConfirmation(false);
    setEditQuickSlotModal(false);
    fetchDailyAvailability(date!);
  }

}catch(error){
  console.log(error)
}
}

async function handleQuickSlotDeletion(){
  try{
  const result =await deleteQuickSlotAPI(deleteQuickSlotId!);
  if(result.data){
    toast.success(result.data.message || "Quick slot deleted successfully.");
    setDeleteQuickSlotId(null);
    setShowDeleteQuickSlot(false);
    fetchDailyAvailability(date!);
  }
  }catch(error){
    console.log(error)
  }
}
  return (
    <div className="space-y-6 px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daily Availability
          </h1>
        </div>
        {date && (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {date.toDateString()}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Regular slots */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {currentSpecialDay?.type
                ? "Special Day Settings"
                : "Regular Availability"}
            </h3>

            <div className="flex flex-wrap gap-3 mb-4">
              {originalSpecialDay?.type ? (
                <>
                  <Button
                    onClick={() => {
                      setShowDeleteSpecialDay(true);
                    }}
                    variant="primary"
                  >
                    Mark as Normal Day
                  </Button>
                  <Button
                    onClick={() => {
                      setEditSpecialDayModal(true);
                    }}
                    variant="primary"
                  >
                    Edit Special Day
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setShowSpecialDayModal(true)}
                  >
                    Mark as Special Day
                  </Button>
                </>
              )}
            </div>

            {/* Slots Section */}
            <div className="border rounded-lg p-4 lg:w-[60vw] m-auto">
              {originalSpecialDay.type === "absent" ||
              originalSpecialDay.type === "override" ? (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Special Day Slots
                  </h4>
                  {/* Container for specialDaySlots */}
                  <div>
                    <SlotGrid
                      availableSlots={specialDaySlots}
                      onSlotClick={() => {}}
                      emptyText="No slots available"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability Rule Slots
                  </h4>
                  {/* Container for availabilityRuleSlots */}
                  <div>
                    <SlotGrid
                      availableSlots={availabilityRuleSlots}
                      onSlotClick={() => {}}
                      emptyText="No slots available"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Slots */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Quick Slots
              </h3>
              <Button
                variant="primary"
                className="flex items-center"
                onClick={() => setShowCreateQuickSlotModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" /> Create Quick Slot
              </Button>
            </div>

            {originalQuickSlots.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No quick slots created.
              </p>
            ) : (
              originalQuickSlots.map((qs) => (
                <div
                  key={qs.quickSlotId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      Quick Slot Group
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm"
                      onClick={()=>{
                        setEditQuickSlotModal(true);
                        const selectedOriginalQuickSlot=originalQuickSlots.find((quickSlot:QuickSlot)=>quickSlot.quickSlotId===qs.quickSlotId)
                        setCurrentQuickSlot({...selectedOriginalQuickSlot})
                      }}
                      >
                        <PencilIcon className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="danger" size="sm"
                       onClick={()=>{
                        setDeleteQuickSlotId(qs.quickSlotId);
                        setShowDeleteQuickSlot(true);
                       }}>
                        <TrashIcon className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>

                  {/* Container for quick slot’s generated slots */}
                  <div>
                    <SlotGrid
                      availableSlots={renderedQuickSlots.filter((renderedQs:RenderedQuickSlot)=>renderedQs.quickSlotId===qs.quickSlotId)[0].slots}
                      onSlotClick={() => {}}
                      emptyText="No slots available"
                    />
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* ---- Special Day Modal ---- */}
      <Modal
        isOpen={showSpecialDayModal}
        onClose={() => setShowSpecialDayModal(false)}
        title="Mark as Special Day"
      >
        <div className="space-y-4 m-5">
          {/* Dropdown for type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentSpecialDay.type || ""}
              onChange={(e) =>
                setCurrentSpecialDay({
                  ...currentSpecialDay,
                  type: e.target.value as "override" | "absent",
                })
              }
            >
              <option value="">Select Type</option>
              <option value="override">Override</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Inputs - visible only if override */}
          {currentSpecialDay.type === "override" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.startTime || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.endTime || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.durationInMins || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      durationInMins: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buffer Time (mins)
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.bufferTimeInMins || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      bufferTimeInMins: Number(e.target.value),
                    })
                  }
                />
              </div>
            </>
          )}

          {!showEditConfirmation && (
            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowSpecialDayModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => setShowEditConfirmation(true)}
              >
                Save
              </Button>
            </div>
          )}

          {showEditConfirmation && (
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                The day will be marked as a special day as above mentioned.Do
                you want to proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={handleSpecialDayCreation}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ---- Edit Special Day Modal ---- */}
      <Modal
        isOpen={editSpecialDayModal}
        onClose={() => {
          setEditSpecialDayModal(false);
          setShowEditConfirmation(false);
        }}
        title="Edit Special Day"
      >
        <div className="space-y-4 m-5">
          {/* Dropdown for type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentSpecialDay.type || ""}
              onChange={(e) =>
                setCurrentSpecialDay({
                  ...currentSpecialDay,
                  type: e.target.value as "override" | "absent",
                })
              }
            >
              <option value="">Select Type</option>
              <option value="override">Override</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Inputs - visible only if override */}
          {currentSpecialDay.type === "override" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={isoToHHMM(currentSpecialDay.startTime!) || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      startTime: HHMMToIso(e.target.value, date!),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={isoToHHMM(currentSpecialDay.endTime!) || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      endTime: HHMMToIso(e.target.value, date!),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.durationInMins || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      durationInMins: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buffer Time (mins)
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  value={currentSpecialDay.bufferTimeInMins || ""}
                  onChange={(e) =>
                    setCurrentSpecialDay({
                      ...currentSpecialDay,
                      bufferTimeInMins: Number(e.target.value),
                    })
                  }
                />
              </div>
            </>
          )}

          {!showEditConfirmation && (
            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditSpecialDayModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => setShowEditConfirmation(true)}
              >
                Save
              </Button>
            </div>
          )}

          {showEditConfirmation && (
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                The edit will be applied to the special day.Do you want to
                proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={handleSpecialDayEdit}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Special Day confirmation modal */}
      <Modal
        isOpen={showDeleteSpecialDay}
        onClose={() => setShowDeleteSpecialDay(false)}
        title="Mark as normal day"
      >
        <div className="space-y-4 text-center m-5">
          <p className="text-gray-700 dark:text-gray-300">
            The day will be marked back as a normal day.Do you want to proceed?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteSpecialDay(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleSpecialDayDeletion}>
              Proceed
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Quick slot confirmation */}
      <Modal
        isOpen={showDeleteQuickSlot}
        onClose={() => {
          setShowDeleteQuickSlot(false)
          setDeleteQuickSlotId(null);
        }}
        title="Delete Quick Slot"
      >
        <div className="space-y-4 text-center m-5">
          <p className="text-gray-700 dark:text-gray-300">
            The quick slot will be deleted.Do you want to proceed?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteQuickSlot(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleQuickSlotDeletion}>
              Proceed
            </Button>
          </div>
        </div>
      </Modal>

      {/* ---- Create Quick Slot Modal ---- */}
      <Modal
        isOpen={showCreateQuickSlotModal}
        onClose={() => {
          setShowCreateQuickSlotModal(false);
          setShowQuickSlotConfirmation(false);
        }}
        title="Create Quick Slot"
      >
        <div className="space-y-4 m-5">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={
                currentQuickSlot.startTime
                  ? isoToHHMM(currentQuickSlot.startTime)
                  : ""
              }
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  startTime: HHMMToIso(e.target.value, date!),
                })
              }
            />
            {quickSlotErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.startTime}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="time"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={
                currentQuickSlot.endTime
                  ? isoToHHMM(currentQuickSlot.endTime)
                  : ""
              }
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  endTime: HHMMToIso(e.target.value, date!),
                })
              }
            />
            {quickSlotErrors.endTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.endTime}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (mins)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentQuickSlot.durationInMins || ""}
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  durationInMins: Number(e.target.value),
                })
              }
            />
            {quickSlotErrors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.duration}
              </p>
            )}
          </div>

          {/* Buffer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buffer Time (mins)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentQuickSlot.bufferTimeInMins || ""}
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  bufferTimeInMins: Number(e.target.value),
                })
              }
            />
            {quickSlotErrors.bufferTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.bufferTime}
              </p>
            )}
          </div>

          {/* Buttons */}
          {!showQuickSlotConfirmation && (
            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowCreateQuickSlotModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => setShowQuickSlotConfirmation(true)}
              >
                Save
              </Button>
            </div>
          )}

          {/* Confirmation */}
          {showQuickSlotConfirmation && (
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                The quick slot will be created for this day. Do you want to
                proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowQuickSlotConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={createQuickSlot}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ---- Edit Quick Slot Modal ---- */}
      <Modal
        isOpen={editQuickSlotModal}
        onClose={() => {
          setEditQuickSlotModal(false);
          setEditQuickSlotConfirmation(false);
          setCurrentQuickSlot({})
        }}
        title="Edit Quick Slot"
      >
        <div className="space-y-4 m-5">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={
                currentQuickSlot.startTime
                  ? isoToHHMM(currentQuickSlot.startTime)
                  : ""
              }
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  startTime: HHMMToIso(e.target.value, date!),
                })
              }
            />
            {quickSlotErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.startTime}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="time"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={
                currentQuickSlot.endTime
                  ? isoToHHMM(currentQuickSlot.endTime)
                  : ""
              }
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  endTime: HHMMToIso(e.target.value, date!),
                })
              }
            />
            {quickSlotErrors.endTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.endTime}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (mins)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentQuickSlot.durationInMins || ""}
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  durationInMins: Number(e.target.value),
                })
              }
            />
            {quickSlotErrors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.duration}
              </p>
            )}
          </div>

          {/* Buffer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buffer Time (mins)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currentQuickSlot.bufferTimeInMins || ""}
              onChange={(e) =>
                setCurrentQuickSlot({
                  ...currentQuickSlot,
                  bufferTimeInMins: Number(e.target.value),
                })
              }
            />
            {quickSlotErrors.bufferTime && (
              <p className="text-red-500 text-sm mt-1">
                {quickSlotErrors.bufferTime}
              </p>
            )}
          </div>

          {/* Buttons */}
          {editQuickSlotConfirmation===false && (
            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditQuickSlotModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => setEditQuickSlotConfirmation(true)}
              >
                Save
              </Button>
            </div>
          )}

          {/* Confirmation */}
          {editQuickSlotConfirmation && (
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                The quick slot will be edited as mentioned. Do you want to
                proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setEditQuickSlotConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={editQuickSlot}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
