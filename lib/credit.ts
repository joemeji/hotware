export const NO = "no";
export const YES = "yes";

export const status: any = {
  [NO]: {
    name: "NO",
    color: "161, 98, 7",
  },
  [YES]: {
    name: "YES",
    color: "21, 128, 61",
  },
};

export const getCreditStatus = ({
  credit_note_is_booked,
}: {
  credit_note_is_booked: string;
}) => {
  if (parseInt(credit_note_is_booked) == 1) {
    return "yes";
  } else {
    return "no";
  }
};

export const isBooked = ({
  credit_note_is_booked,
}: {
  credit_note_is_booked: any;
}) => {
  return parseInt(credit_note_is_booked) == 1 ? true : false;
};

export const isExported = ({
  credit_note_is_exported_by,
}: {
  credit_note_is_exported_by: any;
}) => {
  return credit_note_is_exported_by != null ? true : false;
};
