export const PSYCHOLOGIST_ENDPOINTS = {
// ---------- Applications ----------
LATEST_APPLICATION: "/psychologist/application",
REJECTED_APPLICATION: "/psychologist/application",

// ---------- Dashboard ----------
DASHBOARD: "/psychologist/dashboard",

// ---------- Profile ----------
PROFILE: "/psychologist/profile",
UPDATE_PROFILE: "/psychologist/profile", // PATCH endpoint for updating profile

// ---------- Availability Rules ----------
CREATE_AVAILABILITY_RULE: "/psychologist/availability-rule",
EDIT_AVAILABILITY_RULE: (id: string) => `/psychologist/availability-rule/${id}`,
DELETE_AVAILABILITY_RULE: (id: string) => `/psychologist/availability-rule/${id}`,
FETCH_AVAILABILITY_RULE: (id: string) => `/psychologist/availability-rule?availabilityRuleId=${id}`,
LIST_AVAILABILITY_RULES: "/psychologist/availability-rules",

// ---------- Special Days ----------
CREATE_SPECIAL_DAY: "/psychologist/special-day",
EDIT_SPECIAL_DAY: (id: string) => `/psychologist/special-day/${id}`,
DELETE_SPECIAL_DAY: (id: string) => `/psychologist/special-day/${id}`,

// ---------- Quick Slots ----------
CREATE_QUICK_SLOT: "/psychologist/quick-slot",
EDIT_QUICK_SLOT: (id: string) => `/psychologist/quick-slot/${id}`,
DELETE_QUICK_SLOT: (id: string) => `/psychologist/quick-slot/${id}`,

// ---------- Daily Availability ----------
DAILY_AVAILABILITY: "/psychologist/daily-availability",

// ---------- Sessions ----------
SESSION_LISTING: (params: string) => `/psychologist/sessions/${params}`,
CANCEL_SESSION: (id: string) => `/psychologist/sessions/${id}`,
CHECK_SESSION_ACCESS: (id: string) => `/psychologist/sessions/${id}/access`,

// ---------- Notifications ----------
FETCH_NOTIFICATIONS: (page: number, limit: number) => `/psychologist/notifications?page=${page}&limit=${limit}`,
MARK_NOTIFICATIONS_READ: "/psychologist/notifications",
CLEAR_NOTIFICATIONS: "/psychologist/notifications",
UNREAD_NOTIFICATIONS_COUNT: "/psychologist/notifications/count",

// ---------- Transactions ----------
TRANSACTIONS: (params?: string) => params ? `/psychologist/transactions?${params}` : "/psychologist/transactions",
TRANSACTION_RECEIPT: (id: string) => `/psychologist/transactions/${id}/receipt`,
WALLET: "/psychologist/wallet",

// ---------- Psychologist Apply ----------
APPLY: "/psychologist/apply",
} as const;
