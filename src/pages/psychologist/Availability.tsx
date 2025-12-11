import { useEffect, useState } from "react";
import Calendar from "../../components/UI/Calendar";
import type {
  Availability,
  Slot,
} from "../../types/domain/AvailabiliityRule.types";
import { produce } from "immer";
import { toast } from "sonner";
import Button from "../../components/UI/Button";
import { EyeIcon } from "lucide-react";
import type {
  AvailabilityRuleDetails,
  AvailabilityRuleSummary,
  CreateAvailabilityRulePayload,
  EditAvailabilityRulePayload,
} from "../../types/api/psychologist.types";
import type {
  CreateAvailabilityRule,
  CurrentAvailabilityRule,
} from "../../types/components/psychologist.types";
import {
  createAvailabilityRuleAPI,
  listAvailabilityRules,
  fetchAvailabilityRuleAPI,
  editAvailabilityRuleAPI,
  deleteAvailabilityRuleAPI,
} from "../../services/psychologistService";
import Modal from "../../components/UI/Modal";
import SlotGrid from "../../components/UI/SlotGrid";
import { useGenerateSlots } from "../../hooks/generateSlotsHooks";
import { useNavigate } from "react-router-dom";

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
  const [originalAvailabilityRule, setOriginalAvailabilityRule] =
    useState<AvailabilityRuleDetails>({} as AvailabilityRuleDetails);
  const [currentAvailabilityRule, setCurrentAvailabilityRule] =
    useState<CurrentAvailabilityRule>({} as CurrentAvailabilityRule);
  const [availabilityRuleSlots, setAvailabilityRuleSlots] = useState<Slot[]>(
    []
  );
  const [availabilityRuleSummaries, setAvailabilityRuleSummaries] = useState<
    AvailabilityRuleSummary[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createAvailabilityRule, setCreateAvailabilityRule] =
    useState<CreateAvailabilityRule>({
      weekDay: 0,
      startTime: "",
      endTime: "",
      durationInMins: 0,
      bufferTimeInMins: 0,
    });
  const [availabilityErrors, setAvailabilityErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saveAvailabilityErrors, setSaveAvailabilityErrors] = useState<
    string[]
  >([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [editAvailabilityErrors, setEditAvailabilityErrors] = useState<
    string[]
  >([]);
  const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
  const [deleteAvailabilityRuleId, setDeleteAvailabilityRuleId] = useState<
    null | string
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailabilityRuleSummaries();
  }, []);
  async function fetchAvailabilityRuleSummaries() {
    try {
      const result = await listAvailabilityRules();
      setAvailabilityRuleSummaries(
        produce((draft) => {
          draft.splice(0, draft.length, ...result.data.summaries);
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAvailabilityRule(availabilityRuleId: string) {
    try {
      const res = await fetchAvailabilityRuleAPI(availabilityRuleId);
      if (res.data) {
        setOriginalAvailabilityRule({ ...res.data.availabilityRule });
        setCurrentAvailabilityRule({
          startTime: res.data.availabilityRule.startTime ?? "",
          endTime: res.data.availabilityRule.endTime ?? "",
          durationInMins: res.data.availabilityRule.durationInMins,
          bufferTimeInMins: res.data.availabilityRule.bufferTimeInMins ?? 0,
          availabilityRuleId: res.data.availabilityRule.availabilityRuleId,
        });
        setAvailabilityRuleSlots([]);
        setEditAvailabilityErrors([]);
        setAvailabilityErrors([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function validateAvailability(availability: CreateAvailabilityRule): boolean {
    const errors: string[] = [];

    if (!availability.startTime || !availability.endTime) {
      errors.push("Start time and end time are required.");
    }
    if (availability.durationInMins <= 0) {
      errors.push("Duration must be greater than 0.");
    }
    if (availability.bufferTimeInMins && availability.bufferTimeInMins < 0) {
      errors.push("Buffer time cannot be negative.");
    }

    if (availability.startTime && availability.endTime) {
      const start = new Date(`1970-01-01T${availability.startTime}:00`);
      const end = new Date(`1970-01-01T${availability.endTime}:00`);
      if (end <= start) {
        errors.push("End time must be after start time.");
      }
    }

    setAvailabilityErrors(errors);
    return errors.length === 0;
  }

  function validateAvailabilityRule(
    availability: CreateAvailabilityRule
  ): boolean {
    const errors: string[] = [];

    if (!availability.startTime || !availability.endTime) {
      errors.push("Start and end times are required.");
    }
    if (availability.durationInMins <= 0) {
      errors.push("Duration must be greater than 0.");
    }
    if (availability.bufferTimeInMins && availability.bufferTimeInMins < 0) {
      errors.push("Buffer time cannot be negative.");
    }

    const start = new Date(`1970-01-01T${availability.startTime}:00`);
    const end = new Date(`1970-01-01T${availability.endTime}:00`);
    if (end <= start) {
      errors.push("End time must be after start time.");
    }

    setSaveAvailabilityErrors(errors);
    return errors.length === 0;
  }

  function validateEditAvailabilityRule(
    availability: CurrentAvailabilityRule
  ): boolean {
    const errors: string[] = [];
    if (!availability.startTime || !availability.endTime) {
      errors.push("Start and end times are required.");
    }
    if (availability.durationInMins && availability.durationInMins <= 0) {
      errors.push("Duration must be greater than 0.");
    }
    if (availability.bufferTimeInMins && availability.bufferTimeInMins < 0) {
      errors.push("Buffer time cannot be negative.");
    }

    const start = new Date(`1970-01-01T${availability.startTime}:00`);
    const end = new Date(`1970-01-01T${availability.endTime}:00`);
    if (end <= start) {
      errors.push("End time must be after start time.");
    }

    setEditAvailabilityErrors(errors);
    return errors.length === 0;
  }

  function handlePreviewSlots() {
    if (!validateAvailability(createAvailabilityRule)) return;

    const { startTime, endTime, durationInMins, bufferTimeInMins } =
      createAvailabilityRule;

    const generatedSlots = useGenerateSlots({
      startTime,
      endTime,
      durationInMins,
      bufferTimeInMins,
    });

    setAvailabilityRuleSlots(generatedSlots);
  }

  function handleEditPreviewSlots() {
    if (!validateEditAvailabilityRule(currentAvailabilityRule)) return;

    const { startTime, endTime, durationInMins, bufferTimeInMins } =
      currentAvailabilityRule;
    const generatedSlots = useGenerateSlots({
      startTime: startTime!,
      endTime: endTime!,
      durationInMins: durationInMins!,
      bufferTimeInMins,
    });

    setAvailabilityRuleSlots(generatedSlots);
  }

  async function saveAvailabilityRule() {
    try {
      if (!validateAvailabilityRule(createAvailabilityRule)) {
        return;
      }
      const payload: CreateAvailabilityRulePayload = {
        weekDay: createAvailabilityRule.weekDay,
        startTime: createAvailabilityRule.startTime,
        endTime: createAvailabilityRule.endTime,
        durationInMins: createAvailabilityRule.durationInMins,
        bufferTimeInMins: createAvailabilityRule.bufferTimeInMins || 0,
      };

      const res = await createAvailabilityRuleAPI(payload);

      if (res.data) {
        toast.success(
          res.data.message || "Availability rule created successfully."
        );
        fetchAvailabilityRuleSummaries();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirmation(false);
      setIsModalOpen(false);
      setCreateAvailabilityRule({
        weekDay: 0,
        startTime: "",
        endTime: "",
        durationInMins: 0,
        bufferTimeInMins: 0,
      });
      setAvailabilityRuleSlots([]);
    }
  }

  async function editAvailabilityRule() {
    try {
      if (!validateEditAvailabilityRule(currentAvailabilityRule)) {
        return;
      }

      const payload: EditAvailabilityRulePayload = {};
      if (
        currentAvailabilityRule.startTime !== originalAvailabilityRule.startTime
      ) {
        payload.startTime = currentAvailabilityRule.startTime;
      }
      if (
        currentAvailabilityRule.endTime !== originalAvailabilityRule.endTime
      ) {
        payload.endTime = currentAvailabilityRule.endTime;
      }
      if (
        currentAvailabilityRule.durationInMins !==
        originalAvailabilityRule.durationInMins
      ) {
        payload.durationInMins = currentAvailabilityRule.durationInMins;
      }
      if (
        currentAvailabilityRule.bufferTimeInMins !==
        originalAvailabilityRule.bufferTimeInMins
      ) {
        payload.bufferTimeInMins = currentAvailabilityRule.bufferTimeInMins;
      }
      if (
        currentAvailabilityRule.status !== originalAvailabilityRule.status &&
        currentAvailabilityRule.status
      ) {
        payload.status = currentAvailabilityRule.status;
      }

      if (Object.keys(payload).length === 0) {
        toast.error("No changes detected to save.");
        setShowEditConfirmation(false);
        return;
      }

      const res = await editAvailabilityRuleAPI(
        (originalAvailabilityRule as AvailabilityRuleDetails)
          .availabilityRuleId,
        payload
      );

      if (res.data) {
        toast.success(
          res.data.message || "Availability rule updated successfully."
        );
        await fetchAvailabilityRuleSummaries();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowEditConfirmation(false);
      setAvailabilityRuleSlots([]);
      setCreateAvailabilityRule({} as AvailabilityRuleDetails);
      setCurrentAvailabilityRule({} as CurrentAvailabilityRule);
    }
  }

  function handleConfirmSave() {
    saveAvailabilityRule();
  }

  async function openEditAvailabilityRule(availabilityRuleId: string) {
    await fetchAvailabilityRule(availabilityRuleId);
    setIsEditModalOpen(true);
  }
  async function viewAvailabilityRule(availabilityRuleId: string) {
    try {
      const res = await fetchAvailabilityRuleAPI(availabilityRuleId);
      if (res.data) {
        setOriginalAvailabilityRule({ ...res.data.availabilityRule });
        setCurrentAvailabilityRule({
          startTime: res.data.availabilityRule.startTime ?? "",
          endTime: res.data.availabilityRule.endTime ?? "",
          durationInMins: res.data.availabilityRule.durationInMins,
          bufferTimeInMins: res.data.availabilityRule.bufferTimeInMins ?? 0,
          availabilityRuleId: res.data.availabilityRule.availabilityRuleId,
        });
        const { startTime, endTime, durationInMins, bufferTimeInMins } =
          res.data.availabilityRule;
        const generatedSlots = useGenerateSlots({
          startTime: startTime!,
          endTime: endTime!,
          durationInMins: durationInMins!,
          bufferTimeInMins,
        });

        setAvailabilityRuleSlots(generatedSlots);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDateSelection(date: Date) {
    const params = new URLSearchParams();
    params.append("date", date.toISOString());
    navigate(`/psychologist/daily-availability?${params.toString()}`);
  }

  async function handleDeleteAvailabilityRule() {
    try {
      const result = await deleteAvailabilityRuleAPI(deleteAvailabilityRuleId!);
      if (result.data) {
        toast.success(
          result.data.message || "The availability rule deleted successfully"
        );
        setDeleteAvailabilityRuleId(null);
        setShowDeleteRuleModal(false);
        fetchAvailabilityRuleSummaries();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col align-middle gap-5">
        {/* Availability Exceptions */}
        <div className="mx-auto">
          <section className="glass-card p-6 animate-in w-max">
            <h2 className="text-xl font-semibold text-secondary-700 dark:text-secondary-200 mb-4">
              Set Availability Exceptions
            </h2>
            <Calendar onDateSelect={handleDateSelection} />
          </section>
        </div>

        {/* Rules List */}
        <section className="glass-card p-6 animate-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-200">
              Availability Rules
            </h2>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:shadow-xl"
              onClick={() => setIsModalOpen(true)}
            >
              Create Rule
            </button>
          </div>

          <ul className="space-y-4">
            {availabilityRuleSummaries.length > 0 &&
              availabilityRuleSummaries.map((summary) => (
                <li
                  key={summary.availabilityRuleId}
                  className="glass-card p-4 flex items-center justify-between fade-in"
                >
                  <span className="text-gray-700 dark:text-gray-200">{`Weekday: ${
                    weekdays[summary.weekDay]?.label ?? summary.weekDay
                  }`}</span>
                  <div className="flex flex-cols gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        viewAvailabilityRule(summary.availabilityRuleId)
                      }
                    >
                      <EyeIcon className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        openEditAvailabilityRule(summary.availabilityRuleId)
                      }
                    >
                      <EyeIcon className="w-4 h-4 mr-1" /> Edit
                    </Button>

                    <Button
                      variant="warning"
                      onClick={() => {
                        setDeleteAvailabilityRuleId(summary.availabilityRuleId);
                        setShowDeleteRuleModal(true);
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

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCreateAvailabilityRule({
            weekDay: 0,
            startTime: "",
            endTime: "",
            durationInMins: 0,
            bufferTimeInMins: 0,
          });
          setAvailabilityRuleSlots([]);
        }}
        title="Create Availability Rule"
      >
        <div className="space-y-4 m-5">
          {/* Form Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Weekday */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Weekday
              </label>
              <select
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={createAvailabilityRule.weekDay}
                onChange={(e) =>
                  setCreateAvailabilityRule((prev) => ({
                    ...prev,
                    weekDay: Number(e.target.value),
                  }))
                }
              >
                {weekdays.map((day) => (
                  <option key={day.key} value={day.key}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Start Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={createAvailabilityRule.startTime}
                onChange={(e) =>
                  setCreateAvailabilityRule((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                End Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={createAvailabilityRule.endTime}
                onChange={(e) =>
                  setCreateAvailabilityRule((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={createAvailabilityRule.durationInMins}
                onChange={(e) =>
                  setCreateAvailabilityRule((prev) => ({
                    ...prev,
                    durationInMins: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Buffer Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={createAvailabilityRule.bufferTimeInMins}
                onChange={(e) =>
                  setCreateAvailabilityRule((prev) => ({
                    ...prev,
                    bufferTimeInMins: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Preview button */}
          <div className="pt-4 flex gap-3">
            <Button variant="secondary" onClick={handlePreviewSlots}>
              Preview Slots
            </Button>
          </div>

          {/* Validation errors (preview) */}
          {availabilityErrors.length > 0 && (
            <div className="flex flex-col gap-1 bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {availabilityErrors.map((error, idx) => (
                <div key={idx}>• {error}</div>
              ))}
            </div>
          )}
          {saveAvailabilityErrors.length > 0 && (
            <div className="mt-3 text-red-600 text-sm space-y-1">
              {saveAvailabilityErrors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}
          {/* Slot Grid */}
          {availabilityRuleSlots.length > 0 && (
            <SlotGrid
              availableSlots={availabilityRuleSlots}
              onSlotClick={(startTime) =>
                console.log("Clicked slot:", startTime)
              }
              emptyText="No slots generated"
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => setShowConfirmation(true)}>
              Save
            </Button>
          </div>

          {/* Confirmation Section */}
          {showConfirmation && (
            <div className="mt-6 border border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-gray-100 dark:bg-gray-800 shadow-inner text-center space-y-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                The availability rule will be saved. Do you want to proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={handleConfirmSave}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentAvailabilityRule({} as CurrentAvailabilityRule);
          setAvailabilityRuleSlots([]);
          setEditAvailabilityErrors([]);
          setAvailabilityErrors([]);
        }}
        title="Edit Availability Rule"
      >
        <div className="space-y-4 m-5">
          <div className="grid grid-cols-3 gap-4">
            {/* Start Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Start Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.startTime ?? ""
                }
                onChange={(e) =>
                  setCurrentAvailabilityRule((prev) => ({
                    ...(prev as CurrentAvailabilityRule),
                    startTime: e.target.value,
                  }))
                }
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                End Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.endTime ?? ""
                }
                onChange={(e) =>
                  setCurrentAvailabilityRule((prev) => ({
                    ...(prev as CurrentAvailabilityRule),
                    endTime: e.target.value,
                  }))
                }
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.durationInMins ?? 0
                }
                onChange={(e) =>
                  setCurrentAvailabilityRule((prev) => ({
                    ...(prev as CurrentAvailabilityRule),
                    durationInMins: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Buffer Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.bufferTimeInMins ?? 0
                }
                onChange={(e) =>
                  setCurrentAvailabilityRule((prev) => ({
                    ...(prev as CurrentAvailabilityRule),
                    bufferTimeInMins: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Preview button */}
          <div className="pt-4 flex gap-3">
            <Button variant="secondary" onClick={handleEditPreviewSlots}>
              Preview Slots
            </Button>
          </div>

          {/* Validation errors for preview (reuse availabilityErrors) */}
          {availabilityErrors.length > 0 && (
            <div className="flex flex-col gap-1 bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {availabilityErrors.map((error, idx) => (
                <div key={idx}>• {error}</div>
              ))}
            </div>
          )}

          {/* Validation errors for edit-save */}
          {editAvailabilityErrors.length > 0 && (
            <div className="mt-3 text-red-600 text-sm space-y-1">
              {editAvailabilityErrors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {/* Slot Grid */}
          {availabilityRuleSlots.length > 0 && (
            <SlotGrid
              availableSlots={availabilityRuleSlots}
              onSlotClick={() => {}}
              emptyText="No slots generated"
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
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

          {/* Edit Confirmation Section */}
          {showEditConfirmation && (
            <div className="mt-6 border border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-gray-100 dark:bg-gray-800 shadow-inner text-center space-y-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                The availability rule will be updated. Do you want to proceed?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={editAvailabilityRule}>
                  Proceed
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* View Avaialbility rule Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setCurrentAvailabilityRule({} as CurrentAvailabilityRule);
          setAvailabilityRuleSlots([]);
        }}
        title="View Availability Rule"
      >
        <div className="space-y-4 m-5">
          <div className="grid grid-cols-3 gap-4">
            {/* Start Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Start Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.startTime ?? ""
                }
                readOnly
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                End Time
              </label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.endTime ?? ""
                }
                readOnly
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.durationInMins ?? 0
                }
                readOnly
              />
            </div>

            {/* Buffer Time */}
            <div className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-200 text-sm">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
                value={
                  (currentAvailabilityRule as CurrentAvailabilityRule)
                    ?.bufferTimeInMins ?? 0
                }
                readOnly
              />
            </div>
          </div>

          {/* Slot Grid */}
          {availabilityRuleSlots.length > 0 && (
            <SlotGrid
              availableSlots={availabilityRuleSlots}
              onSlotClick={() => {}}
              emptyText="No slots generated"
            />
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setIsViewModalOpen(false);
              setCurrentAvailabilityRule({} as CurrentAvailabilityRule);
              setAvailabilityRuleSlots([]);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Delete Availability rule confirmation */}
      <Modal
        isOpen={showDeleteRuleModal}
        onClose={() => {
          setShowDeleteRuleModal(false);
          setDeleteAvailabilityRuleId(null);
        }}
        title="Delete Quick Slot"
      >
        <div className="space-y-4 text-center m-5">
          <p className="text-gray-700 dark:text-gray-300">
            The availability rule will be deleted.Do you want to proceed?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteRuleModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleDeleteAvailabilityRule}>
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
