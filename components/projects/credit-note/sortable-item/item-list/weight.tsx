export default function Weight({item}: any) {
  return (
    <div className="w-[130px] p-2 text-right">
      <span className="text-sm">{item.shipping_item_weight}</span>
    </div>
  );
}