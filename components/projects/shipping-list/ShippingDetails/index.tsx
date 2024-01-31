import AvatarProfile from "@/components/AvatarProfile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import StatusChip from "../StatusChip";

function ShippingDetails(props: ShippingDetailsProps) {
  const { details } = props;
  const { data } = details;
  
  return (
    <>
      <div className="w-1/4 h-[calc(100vh-var(--header-height)-40px)] top-[calc(var(--header-height)+20px)] rounded-sm overflow-hidden sticky">
        <ScrollArea 
          className={cn("bg-white", " p-5 h-[calc(100vh-var(--header-height)-40px)]")}
        >
          {data && (
            <>
              <p className="text-xl font-bold mb-4 sticky top-0 bg-white z-10">
                {data && data.shipping_description}
              </p>
              <Details data={data} />
            </>
          )}
        </ScrollArea> 

        {data && (
          <Link 
            href={`/projects/shipping-list/${data._shipping_id}/edit`}
          >
            <Button 
              className={cn(
                "absolute bottom-3 right-3 flex items-center drop-shadow-xl gap-2",
              )}
            >
              <Pencil className="w-5 h-5 text-white" /> 
              <span className="text-white font-medium">Edit</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}

export default memo(ShippingDetails);

function Details({ data }: { data: any }) {
  return (
    <>
      <Detail className="gap-2">
        <p className="text-sm text-right flex gap-1">Created at 
          <span className="font-medium">
            {data.added_date ? dayjs(data.added_date).format('MMM DD, YYYY HH:ss a') : '-'}
          </span>
        </p>

        <div className="flex gap-1 items-center">
          <span className="text-sm text-stone-600">by</span>
          <div className="flex gap-1 items-center">
            <AvatarProfile 
              firstname={data.user_firstname}
              lastname={data.user_lastname}
              photo={baseUrl + '/users/thumbnail/' + data.user_photo}
              avatarClassName="w-6 h-6"
              avatarColor={data.avatar_color}
              avatarFallbackClassName="font-medium text-white text-xs"
            />
            <span className="text-sm font-medium flex">{data.user_firstname + ' ' +  data.user_lastname}</span>
          </div>
        </div>
      </Detail>

      <div className="border-2 border-stone-100 p-3 flex justify-between items-center rounded-xl mb-3">
        <p className="text-sm font-medium text-stone-500">Status</p>
        <StatusChip status={data.shipping_status} />
      </div>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Deliver To</p>
        <div>
          <p className="font-bold">{data.client || ''}</p>
          {data.cms_address_building && <p>{data.cms_address_building}</p>}
          {data.cms_address_street && <p>{data.cms_address_street}</p>}
          <p>{data.cms_address_city ? data.cms_address_city + ', ' : ''}{data.cms_address_country || ''}</p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Invoice To</p>
        <div>
          <p className="font-bold">{data.supplier || ''}</p>
          {data.supplier_address_building && <p>{data.supplier_address_building}</p>}
          {data.supplier_address_street && <p>{data.supplier_address_street}</p>}
          <p>{data.supplier_address_city ? data.supplier_address_city + ', ' : ''}{data.supplier_address_country || ''}</p>
        </div>
      </Detail>
      <Detail>
        <p className="text-sm font-medium text-stone-500">Warehouse</p>
        <div>
          <p className="font-bold">{data.warehouse_name} ({data.warehouse_location})</p>
        </div>
      </Detail>
      
      <Detail>
        <p className="text-sm font-medium text-stone-500">Delivery Date</p>
        <div>
          <p className="font-bold">
            {data.shipping_delivery_date ? dayjs(data.shipping_delivery_date).format('MMMM DD, YYYY') : '-'}
          </p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Currency</p>
        <div>
          <p className="font-bold">{data.currency}</p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Furnace</p>
        <div>
          <p className="font-bold">{data.shipping_furnace || '-'}</p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Type of Unit</p>
        <div>
          <p className="font-bold">{data.shipping_type_of_unit || '-'}</p>
        </div>
      </Detail>
      
      <Detail className="mb-0">
        <p className="text-sm font-medium text-stone-500">Work</p>
        <div>
          <p className="font-bold">{data.shipping_work || '-'}</p>
        </div>
      </Detail>
    </>
  );
}

function Detail({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("border-2 border-stone-100 p-3 flex flex-col gap-3 rounded-xl mb-3", className)}>
      {children}
    </div>
  )
}

type ShippingDetailsProps = {
  access_token?: string
  details?: any
}