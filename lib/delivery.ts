export const CLOSED = "closed";
export const CANCELLED = "cancelled";
export const OPEN = "open";

export const status: any = {
  [CLOSED]: {
    name: "Closed",
    color: "185, 28, 28",
  },
  [OPEN]: {
    name: "Open",
    color: "202, 138, 4",
  },
};

export const getDeliveryStatus = ({
  delivery_note_status,
}: {
  delivery_note_status: string;
}) => {
  if (delivery_note_status == "closed") {
    return "closed";
  } else {
    return "open";
  }
};

export const isClosed = ({
  delivery_note_status,
}: {
  delivery_note_status: string;
}) => {
  if (delivery_note_status == "closed") {
    return true;
  } else {
    return false;
  }
};
