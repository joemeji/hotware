export const mutateIndex = (_shipping_id: any) => {
  return `/api/shipping/${_shipping_id}/items`;
};

export const saveScannedItemApi = async (
  _shipping_id: any,
  payload: {
    _item_id?: any;
    _serial_number_id?: any;
  }
) => {
  const res = await fetch(
    "/api/shipping/" + _shipping_id + "/item/save_scanned_item",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const json = await res.json();

  return json;
};

export const returnItemApi = async (
  _shipping_id: any,
  payload: {
    shipping_item_id: any;
    return_quantity: number;
    is_consumable?: boolean;
    shipping_item_details_id?: any;
  }
) => {
  const res = await fetch(`/api/shipping/${_shipping_id}/return_equipment`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const json = await res.json();

  return json;
};

export const resetItemApi = async (
  _shipping_id: any,
  payload: {
    shipping_return_item_id: any;
  }
) => {
  const res = await fetch(`/api/shipping/${_shipping_id}/reset_equipment`, {
    method: "POST",
    body: JSON.stringify({
      shipping_return_item_id: payload.shipping_return_item_id,
    }),
  });
  const json = await res.json();
  return json;
};

export const markCompletedItemApi = async (
  _shipping_id: any,
  payload: {
    shipping_item_id: any;
    sisl_id?: any;
  }
) => {
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
  };

  const res = await fetch(
    "/api/shipping/" + _shipping_id + "/complete_nonserialized",
    options
  );
  const json = await res.json();

  return json;
};

export const deleteShippingItemApi = async (_shipping_id: any, { shipping_item_id, isDelete = false }: { shipping_item_id: any, isDelete?: boolean }) => {
  const options = {
    method: "POST",
    body: JSON.stringify({
      shipping_item_id: shipping_item_id,
      delete: isDelete || false,
    }),
  };
  const res = await fetch(
    `/api/shipping/${_shipping_id}/item/delete`,
    options
  );
  const json = await res.json();

  return json;
}
