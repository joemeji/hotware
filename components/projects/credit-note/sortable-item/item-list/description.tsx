import { baseUrl } from "@/utils/api.config";
import Image from "next/image";

export default function Description({ descriptionWidth, item }: Description) {
  return (
    <div className="flex items-start gap-1" style={{ width: ((descriptionWidth || 342)) + 'px' }}>
      {/* <div className="w-[15px] h-[15px] bg-red-300 rounded-full mt-1" /> */}
      <Image
        alt={item.shipping_item_name}
        width={60}
        height={60} 
        className="w-[60px] h-[60px] object-cover rounded-sm"
        src={baseUrl + '/equipments/thumbnail/' + item.item_image} 
        onError={(e: any) => {
          e.target.srcset = `${baseUrl}/equipments/thumbnail/Coming_Soon.jpg`;
        }}
      />
      <div className="flex flex-col px-2">
        <span className="font-medium" dangerouslySetInnerHTML={{ __html: item.shipping_item_name || '' }} />
        <span className="text-stone-500">{item.shipping_item_country_of_origin}</span>
      </div>
    </div>
  );
}

type Description = {
  descriptionWidth?: number
  item?: any
}