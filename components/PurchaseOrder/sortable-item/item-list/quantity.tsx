export default function Quantity({ item }: any) {

  const totalAdded = () => {
    if (Number(item.with_serial) === 1) {
      return Number(item.total_added);
    }
    if (Number(item.with_serial) === 0) {
      return Number(item.unserialized_total_added);
    }
    return 0;
  };

  const quantityStatus = () => {
    if (item.is_custom == 1) {
      return <>
        <span className="font-bold">
          {item.custom_total_added || 0}
        </span>{Number(item.custom_total_added) !== Number(item.shipping_item_quantity) && '/' +item.shipping_item_quantity}
      </>
    }
    return (
      <>
        <span className="font-bold">
          {totalAdded()}
        </span>{totalAdded() !== Number(item.shipping_item_quantity) && '/' +item.shipping_item_quantity}
      </>
    );
  }

  return (
    <div className="w-[100px] p-2 text-right">
      {quantityStatus()}
    </div>
  );
}