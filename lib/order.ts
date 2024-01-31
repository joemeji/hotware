export const CLOSED = "closed";
export const CANCELLED = "cancelled";
export const OPEN = "open";

export const status: any = {
  [CLOSED]: {
    name: "Closed",
    color: "185, 28, 28",
  },
  [CANCELLED]: {
    name: "Cancelled",
    color: "161, 98, 7",
  },
  [OPEN]: {
    name: "Open",
    color: "202, 138, 4",
  },
};

export const getOrderStatus = ({
  order_confirmation_status,
}: {
  order_confirmation_status: string;
}) => {
  if (order_confirmation_status == "closed") {
    return "closed";
  } else if (order_confirmation_status == "cancelled") {
    return "cancelled";
  } else {
    return "open";
  }
};
