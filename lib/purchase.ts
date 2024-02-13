export const CLOSED = "closed";
export const APPROVAL = "approval";
export const APPROVED = "approved";
export const OPEN = "open";

export const status: any = {
  [CLOSED]: {
    name: "Closed",
    color: "255, 118, 118",
  },
  [APPROVAL]: {
    name: "Approval",
    color: "255, 195, 109",
  },
  [APPROVED]: {
    name: "Approved",
    color: "44, 171, 227",
  },
  [OPEN]: {
    name: "Open",
    color: "21, 128, 61",
  },
};

export const getPurchaseStatus = ({ po_status }: { po_status: string }) => {
  if (po_status == "closed") {
    return "closed";
  } else if (po_status == "approval") {
    return "approval";
  } else if (po_status == "approved") {
    return "approved";
  } else {
    return "open";
  }
};

export const isOpen = ({ po_status }: { po_status: string }) => {
  if (po_status == "active") {
    return true;
  }

  return false;
};
