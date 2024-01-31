export default function HSCode({item}: any) {
  let hscode = item.shipping_item_hs_code;

  if (item?.item_set_id) {
    hscode = item.item_set_hs_code;
  }

  return (
    <div className="w-[155px] p-2 text-right">
      <span className="text-sm">{hscode}</span>
    </div>
  );
}