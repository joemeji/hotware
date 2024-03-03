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
  invoice_is_exported_by,
}: {
  invoice_status: string;
  invoice_is_booked: any;
  invoice_has_credit_note: any;
  invoice_is_exported_by: any;
}) => {
  const hasCreditNote = invoice_has_credit_note != 0;
  const isBooked = invoice_is_booked != 0;
  if (
    invoice_status == "active" &&
    !isBooked &&
    !hasCreditNote &&
    !invoice_is_exported_by
  ) {
    return true;
  }

  return false;
};

export const canBook = ({
  invoice_is_booked,
  invoice_is_exported_by,
}: {
  invoice_is_booked: boolean;
  invoice_is_exported_by: any;
}) => {
  if (!invoice_is_booked || !invoice_is_exported_by) {
    return true;
  }

  return false;
};
