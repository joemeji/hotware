export const mutateIndex = (_shipping_id: any, shipping_item_id: any) => {
  return `/api/shipping/${_shipping_id}/set/item/${shipping_item_id}`;
};

export const removeSetItemApi = async (
  _shipping_id: any,
  payload: {
    sisl_id: any;
    delete: boolean;
  }
) => {
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
  };
  const res = await fetch(
    `/api/shipping/${_shipping_id}/set/item/delete`,
    options
  );
  const json = await res.json();
  return json;
};
