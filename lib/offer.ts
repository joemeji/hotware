export const WON = "won";
export const LOST = "lost";
export const OPEN = "open";

export const status: any = {
  [WON]: {
    name: "Won",
    color: "21, 128, 61",
  },
  [LOST]: {
    name: "Lost",
    color: "185, 28, 28",
  },
  [OPEN]: {
    name: "Open",
    color: "202, 138, 4",
  },
};

export const getOfferStatus = ({
  offer_has_order_confirmation,
  offer_status,
}: {
  offer_has_order_confirmation: number;
  offer_status: string;
}) => {
  const hasOC = offer_has_order_confirmation ?? 0;
  if (hasOC != 0) {
    return "won";
  } else if (offer_status == "cancelled") {
    return "lost";
  } else {
    return "open";
  }
};
