export default function HSCode({item}: any) {
  return (
    <div className="w-[155px] p-2 text-right">
      <span className="text-sm">{item.shipping_item_hs_code}</span>
    </div>
  );
}