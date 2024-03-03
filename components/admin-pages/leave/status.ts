export const PENDING = "pending";
export const APPROVED = "approved";
export const REJECTED = "rejected";
export const CANCELLED = "cancelled";

export const status: any = {
  [PENDING]: {
    name: "Pending",
    color: "249, 115, 22",
  },
  [APPROVED]: {
    name: "Approved",
    color: "34, 197, 94",
  },
  [REJECTED]: {
    name: "Rejected",
    color: "239, 68, 68",
  },
  [CANCELLED]: {
    name: "Cancelled",
    color: "239, 68, 68",
  },
};
