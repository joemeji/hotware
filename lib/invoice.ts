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

export const isOpen = ({
  invoice_status,
  invoice_is_booked,
  invoice_has_credit_note,
}: {
  invoice_status: string;
  invoice_is_booked: boolean;
  invoice_has_credit_note: string;
}) => {
  const hasCreditNote =
    isNaN(parseInt(invoice_has_credit_note)) ||
    Number(invoice_has_credit_note) != 0;
  if (
    invoice_status == "active" &&
    !Number(invoice_is_booked) &&
    !hasCreditNote
  ) {
    return true;
  }

  return false;
};
