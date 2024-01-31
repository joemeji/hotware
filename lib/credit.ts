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
  credit_note_is_booked: number;
}) => {
  if (credit_note_is_booked == 0) {
    return "no";
  } else {
    return "yes";
  }
};
