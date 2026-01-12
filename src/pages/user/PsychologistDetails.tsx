import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { format } from "date-fns";
import {
  createOrder,
  fetchCheckoutData,
  fetchPsychDetailsByUser,
  listPsychReviewsAPI,
  verifyPayment,
} from "../../services/userService";
import Modal from "../../components/UI/Modal";
import type { CheckoutData, RazorpayOptions, RazorPayType } from "../../types/components/user.types";
import { toast } from "sonner";
import type { Slot } from "../../types/domain/AvailabiliityRule.types";
import type { ListPsychReviewsItem } from "../../types/api/user.types";
import type paginationData from "../../types/pagination.types";
import { produce } from "immer";
import Pagination from "../../components/Pagination";
import { Check, X } from "lucide-react";
 declare let Razorpay: RazorPayType;
 
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
}

const PsychologistDetails: React.FC = () => {
  const location = useLocation();

  const psychId = new URLSearchParams(location.search).get("psychId");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [psychologist, setPsychologist] = useState<Omit<
    PsychDetails,
    "availableSlots"
  > | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(
    {} as CheckoutData
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [reviews, setReviews] = useState<ListPsychReviewsItem[]>([]);
  //const [sortReviews, setSortReviews] = useState<"recent" | "top-rated">( "recent" );
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 5,
  });

  // --- Fetch Psychologist Details ---
  const fetchPsychologistDetails = async (date: Date) => {
    if (!psychId) return;
    try {
      const params = new URLSearchParams();
      params.append("date", date.toISOString());
      params.append("psychId", psychId);
      const res = await fetchPsychDetailsByUser(params.toString());
      if (res.data) {
        const data = res.data;
        console.log(res.data.availableSlots);
        setAvailableSlots(data.availableSlots);
        const { availableSlots: _unused, ...psychInfo } = data;
        setPsychologist(psychInfo);
      }
    } catch (error) {
      setAvailableSlots([]);
      console.error("Error fetching psychologist details:", error);
    }
  };

  useEffect(() => {
    fetchPsychologistDetails(selectedDate);
  }, [psychId, selectedDate]);
  useEffect(() => {
    loadReviews();
  }, [psychId, pagination.currentPage]);

  const loadReviews = async () => {
    try {
      if (!psychId) {
        return;
      }
      const queryParams = new URLSearchParams();
      queryParams.set("page", pagination.currentPage.toString());
      queryParams.set("limit", pagination.pageSize.toString());
      queryParams.set("psychId", psychId);
      queryParams.set("sort", "recent");
      const result = await listPsychReviewsAPI(queryParams.toString());

      if (result.data) {
        setReviews(result.data.reviews);
        setPagination(result.data.paginationData);
      }
    } catch (error) {
      console.log("error fetching reviews", error);
    }
  };

  const handleSlotClick = async (slot: string) => {
    try {
      setSelectedSlot(slot);
      const result = await fetchCheckoutData({
        startTime: slot,
        date: selectedDate.toISOString(),
        psychId: psychologist!.psychId,
      });
      if (result.data) {
        setCheckoutData({ ...result.data.data });
        setShowCheckoutModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function handleProceedPayment() {
    try {
      const result = await createOrder({
        startTime: selectedSlot,
        date: selectedDate.toISOString(),
        psychId: psychologist!.psychId,
      });

      if (result.data) {
        handlePayment(
          result.data.data.providerOrderId,
          result.data.data.amount,
          result.data.data.sessionId
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePayment(
    orderId: string,
    amount: number,
    sessionId: string
  ) {
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const options:RazorpayOptions = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "CalmConnect",
        description: "Therapy Session Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            const result = await verifyPayment({
              providerPaymentId: response.razorpay_payment_id,
              providerOrderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              sessionId,
            });
            if (result.data) {
              toast.success("Session booked successfully");
              setShowCheckoutModal(false);
              fetchPsychologistDetails(selectedDate);
            }
          } catch (error) {
            console.log(error);
          }
        },
        prefill: {
          name: "change later",
          email: "change later",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-background py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        {/* <div className="mb-4">
          <Button
            size="sm"
            onClick={() => navigate("/user/book")}
            className="text-sm"
          >
            ← Back to Browse
          </Button>
        </div>
 */}
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
                      onClick={() => handleSlotClick(`${slot.startTime}`)}
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
                key={review.reviewId}
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
                    {"Anonymous"} •{" "}
                    {new Date(review.createdAt).toLocaleDateString()}{" "}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Pagination
          paginationData={pagination}
          setCurrentPage={(page: number) =>
            setPagination(
              produce((draft) => {
                draft.currentPage = page;
              })
            )
          }
        />
      </div>

      {/* Checkout modal */}

      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Checkout Data"
      >
        <div className="flex flex-col space-y-4 m-5">
          {/* Checkout Info */}
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex justify-between text-md text-foreground">
              <span>Start Time:</span>
              <span>
                {checkoutData.startTime
                  ? new Date(checkoutData.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between text-md text-foreground">
              <span>End Time:</span>
              <span>
                {checkoutData.endTime
                  ? new Date(checkoutData.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between text-md text-foreground">
              <span>Duration:</span>
              <span>{checkoutData.durationInMins} mins</span>
            </div>
            <div className="flex justify-between text-md text-foreground">
              <span>Fees:</span>
              <span>₹{checkoutData.fees}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 w-full">
            <label
              htmlFor="paymentMethod"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Select Payment Method
            </label>
            <select
              id="paymentMethod"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white dark:bg-gray-700"
            >
              <option value="razorpay">Razorpay</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowCheckoutModal(false)}
            >
              <X/>
            </Button>
            <Button variant="success" onClick={handleProceedPayment}>
              <Check/>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PsychologistDetails;
