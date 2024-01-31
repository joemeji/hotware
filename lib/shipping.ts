export const ACTIVE = "active";
export const SHIPPED = "shipped";
export const RETURNED = "returned";
export const CLOSED = "closed";

export const status: any = {
  [ACTIVE]: {
    name: "Active",
    color: "21, 128, 61",
  },
  [SHIPPED]: {
    name: "Shipped",
    color: "185, 28, 28",
  },
  [RETURNED]: {
    name: "Returned",
    color: "202, 138, 4",
  },
};

export const addressFormat = (
  building?: any,
  street?: any,
  city?: any,
  country?: any
) => {
  let address = [];
  address[0] = building ? building?.replace(",", "") : null;
  address[1] = street ? street?.replace(",", "") : null;
  address[2] = city ? city?.replace(",", "") : null;
  address[3] = country ? country?.replace(",", "") : null;

  return address.filter((item: any) => item !== null).join(", ");
};
