export const ADMIN_ENDPOINTS = {
// ---------- Applications ----------
FETCH_APPLICATIONS: "/admin/applications",
APPLICATION_DETAILS: (applicationId: string) => `/admin/application/${applicationId}`,
UPDATE_APPLICATION: (applicationId: string) => `/admin/application/${applicationId}`,

// ---------- Users ----------
FETCH_USERS: "/admin/users",
USER_DETAILS: (userId: string) => `/admin/user-details/${userId}`,
UPDATE_USER_STATUS: (userId: string) => `/admin/user/${userId}`,

// ---------- Psychologists ----------
FETCH_PSYCHOLOGISTS: "/admin/psychologists",
PSYCH_DETAILS: (psychId: string) => `/admin/psychologist-details/${psychId}`,
UPDATE_PSYCH_STATUS: (psychId: string) => `/admin/psychologist/${psychId}`,

// ---------- Sessions ----------
SESSION_LISTING: (params: string) => `/admin/sessions/${params}`,

// ---------- Notifications ----------
FETCH_NOTIFICATIONS: "/admin/notifications",                                  
MARK_NOTIFICATIONS_READ: "/admin/notifications",
CLEAR_NOTIFICATIONS: "/admin/notifications",
UNREAD_NOTIFICATIONS_COUNT: "/admin/notifications/count",

// ---------- Transactions ----------
TRANSACTIONS: "/admin/transactions",                                          
TRANSACTION_RECEIPT: (id: string) => `/admin/transactions/${id}/receipt`,
WALLET: "/admin/wallet",

// ---------- Complaints ----------
LIST_COMPLAINTS: "/admin/complaints",                                             
COMPLAINT_DETAILS: (complaintId: string) => `/admin/complaints/${complaintId}`,
COMPLAINT_HISTORY: "/admin/complaints",                                               
RESOLVE_COMPLAINT: (complaintId: string) => `/admin/complaints/${complaintId}`,

// ---------- Dashboard ----------
DASHBOARD_REVENUE: "/admin/dashboard/revenue",                                         
DASHBOARD_CLIENTS: "/admin/dashboard/clients",                                        
DASHBOARD_SESSIONS: "/admin/dashboard/sessions",                                        
DASHBOARD_TOP_PSYCHOLOGISTS: "/admin/dashboard/top-psychologists",                                   
DASHBOARD_SUMMARY_CARDS: "/admin/dashboard/summary-cards",                             
} as const;
