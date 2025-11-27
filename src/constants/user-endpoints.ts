export const USER_ENDPOINTS = {
  // ---------- Dashboard ----------
  DASHBOARD: "/user/dashboard",

  // ---------- Psychologists ----------
  LIST_PSYCHOLOGISTS: (params: string) => `/user/psychologists?${params}`,
  PSYCH_DETAILS: (params: string) => `/user/psychologist-details?${params}`,

  // ---------- Profile ----------
  USER_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",

  // ---------- Checkout ----------
  CHECKOUT: (params: string) => `/user/checkout?${params}`,
  CREATE_ORDER: "/user/create-order",
  VERIFY_PAYMENT: "/user/verify-payment",

  // ---------- Sessions ----------
  LIST_SESSIONS: (params: string) => `/user/sessions/${params}`,
  CANCEL_SESSION: (sessionId: string) => `/user/sessions/${sessionId}`,
  CHECK_SESSION_ACCESS: (sessionId: string) =>
    `/user/sessions/${sessionId}/access`,

  // ---------- Notifications ----------
  FETCH_NOTIFICATIONS: (page: number, limit: number) =>
    `/user/notifications?page=${page}&limit=${limit}`,
  MARK_NOTIFICATIONS_READ: "/user/notifications",
  CLEAR_NOTIFICATIONS: "/user/notifications",
  UNREAD_NOTIFICATIONS_COUNT: "/user/notifications/count",

  // ---------- Wallet & Transactions ----------
  TRANSACTIONS: (params: string) => `/user/transactions?${params}`,
  TRANSACTION_RECEIPT: (id: string) => `/user/transactions/${id}/receipt`,
  WALLET: "/user/wallet",

  // ---------- Complaints ----------
  CREATE_COMPLAINT: "/user/complaints",
  LIST_COMPLAINTS: (params: string) => `/user/complaints?${params}`,
  COMPLAINT_DETAILS: (complaintId: string) =>
    `/user/complaints/${complaintId}`,

  // ---------- Reviews ----------
  CREATE_REVIEW: "/user/reviews/",
  LIST_REVIEWS: (query: string) => `/user/reviews?${query}`,
} as const;
