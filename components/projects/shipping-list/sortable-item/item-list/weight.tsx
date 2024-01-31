export default function Weight({item}: any) {
  let weight = item.shipping_item_weight;

  if (item?.item_set_id) {
    weight = item.item_set_list_weight;
  }

  return (
    <div className="w-[130px] p-2 text-right">
      <span className="text-sm">{weight}</span>
    </div>
  );
}