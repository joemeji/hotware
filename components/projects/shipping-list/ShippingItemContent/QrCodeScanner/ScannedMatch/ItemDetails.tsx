import { truncate } from "@/utils/text";
import Image from "next/image";
import { memo, useContext } from "react";
import { ShippingItemContext } from "..";
import { baseUrl } from "@/utils/api.config";

function ItemDetails() {
  const shippingItem: any = useContext(ShippingItemContext);

  return (
    <div className="p-4 flex gap-3">
      <Image 
        src={shippingItem ? `${baseUrl}/equipments/thumbnail/${shippingItem.item_image}` : ''}
        width={100} height={100} 
        className="w-[100px] h-[100px] object-cover rounded-sm" 
        alt="Item name" 
      />
      <div>
        <div className="flex flex-col gap-1 h-full">
          <div className="bg-yellow-400 px-2 rounded-xl w-fit">
            {shippingItem && (
              shippingItem.with_serial == 1 ? 'Serialized' : 'Non-serialized'
            )}
          </div>
          <p className="text-base font-medium">
            {truncate(shippingItem && (shippingItem.shipping_item_name || shippingItem.item_name), 50)}
          </p>
          <p>{shippingItem && shippingItem.article_number}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ItemDetails);