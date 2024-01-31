export const PAID = "paid";
export const LOST = "lost";
export const OPEN = "open";
export const BOOKED = "booked";
export const UNBOOKED = "unbooked";

export const status: any = {
  [PAID]: {
    name: "Paid",
    color: "44, 171, 227",
  },
  [OPEN]: {
    name: "Open",
    color: "202, 138, 4",
  },
  [BOOKED]: {
    name: "Yes",
    color: "83, 230, 157",
  },
  [UNBOOKED]: {
    name: "No",
    color: "202, 138, 4",
  },
};

export const getInvoiceStatus = ({
  invoice_status,
}: {
  invoice_status: string;
}) => {
  if (invoice_status == "paid") {
    return "paid";
  } else {
    return "open";
  }
};
