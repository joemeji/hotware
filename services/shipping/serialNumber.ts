type deleteSerialNumberPayload = {
  shipping_item_details_id: any
  shipping_item_id: any
  _shipping_id: any
}

export const deleteSerialNumberApi = async (payload: deleteSerialNumberPayload) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ 
      shipping_item_details_id: payload.shipping_item_details_id,
      shipping_item_id: payload.shipping_item_id,
      _shipping_id: payload._shipping_id,
    }),
  };
  const res = await fetch(`/api/shipping/${payload._shipping_id}/serial_number/delete`, options);
  const json = await res.json();

  return json;
};