import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { format } from "date-fns";
import { fetchPsychDetailsByUser } from "../../services/userService";

// Backend DTO
export interface Slot {
  startTime: string;
  endTime: string;
  quick: boolean;
}

export interface PsychDetails {
  availableSlots: Slot[];
  psychId: string;
  name: string;
  rating: number;
  specializations: string[];
  bio: string;
  qualifications: string;
  profilePicture: string;
  hourlyFees: number;
  quickSlotFees: number;
}

const PsychologistDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const psychId = new URLSearchParams(location.search).get("psychId");
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date()
  );
  const [psychologist, setPsychologist] = useState<Omit<
    PsychDetails,
    "availableSlots" | "psychId"
  > | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("new Date()");

  // --- Fetch Psychologist Details ---
  const fetchPsychologistDetails = async (date: Date) => {
    if (!psychId) return;
    try {
      const params = new URLSearchParams();
      params.append("date",date.toISOString());
      params.append("psychId", psychId);
      const res = await fetchPsychDetailsByUser(params.toString());
      console.log(res.data);
      if (res.data) {
        let data=res.data
        setAvailableSlots(data.availableSlots);
        const { availableSlots: _, psychId: __, ...psychInfo } = data;
        setPsychologist(psychInfo);
      }
    } catch (error) {
      console.error("Error fetching psychologist details:", error);
    }
  };

  useEffect(() => {
    fetchPsychologistDetails(selectedDate);
  }, [psychId, selectedDate]);

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    navigate("/user/payment", {
      state: {
        psychologist,
        date: selectedDate,
        time: slot,
        amount: psychologist?.hourlyFees,
      },
    });
  };

  // Dummy reviews (stay as they are)
  const reviews = [
    {
      id: 1,
      user: "Anonymous",
      rating: 5,
      text: "Dr. Johnson helped me overcome my anxiety.",
      date: "2024-07-15",
      consultations: 8,
    },
    {
      id: 2,
      user: "Anonymous",
      rating: 5,
      text: "Excellent therapist. I feel much better after our sessions.",
      date: "2024-07-10",
      consultations: 12,
    },
    {
      id: 3,
      user: "Anonymous",
      rating: 4,
      text: "Very helpful and understanding. Recommended!",
      date: "2024-07-05",
      consultations: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            size="sm"
            onClick={() => navigate("/user/book")}
            className="text-sm"
          >
            ← Back to Browse
          </Button>
        </div>

        {/* Psychologist Info */}
        {psychologist && (
          <Card className="p-4 mb-4 shadow-glass bg-gradient-glass">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <img
                  src={psychologist.profilePicture}
                  alt={psychologist.name}
                  className="w-24 h-24 rounded-lg object-cover mx-auto md:mx-0"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground mb-2">
                  {psychologist.name}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="font-medium text-sm">
                      {psychologist.rating}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {psychologist.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {psychologist.bio}
                </p>
                <p className="text-sm text-foreground mb-1">
                  <span className="font-medium">Qualifications: </span>
                  {psychologist.qualifications}
                </p>
                <div className="flex gap-4 text-sm">
                  <p className="text-foreground">
                    <span className="font-medium">Hourly Fees: </span>₹
                    {psychologist.hourlyFees}
                  </p>
                  <p className="text-foreground">
                    <span className="font-medium">Quick Slot Fees: </span>₹
                    {psychologist.quickSlotFees}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Availability Section */}
        <Card className="p-4 mb-4 shadow-glass bg-gradient-glass">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Availability
            </h2>
          </div>

          {/* Date picker */}
          <div className="mb-4">
            <input
              type="date"
              value={selectedDate.toISOString()}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              placeholder="Select specific date"
              className="max-w-xs text-sm"
            />
          </div>

          {/* Available slots */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Available slots for{" "}
                {format(new Date(selectedDate), "MMM dd, yyyy")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSlotClick(`${slot.startTime}-${slot.endTime}`)
                      }
                      className="p-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/10 transition-colors"
                    >
                      {`${slot.startTime} - ${slot.endTime}`}
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-muted-foreground text-sm">
                    No slots available for this date
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Reviews Section */}
        <Card className="p-4 shadow-glass bg-gradient-glass">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-3 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xs">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.user} • {new Date(review.date).toLocaleDateString()}{" "}
                    • {review.consultations} consultations
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PsychologistDetails;
