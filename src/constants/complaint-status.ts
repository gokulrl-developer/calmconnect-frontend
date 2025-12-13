export const ComplaintStatus={
    RESOLVED:"resolved",
    PENDING:"pending"
} as const;

export type ComplaintStatus=
typeof ComplaintStatus[keyof typeof ComplaintStatus]