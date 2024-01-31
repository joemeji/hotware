import { ItemMenu, TD, TH } from "@/components/items";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { addressFormat } from "@/lib/shipping";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import { baseUrl } from "@/utils/api.config";
import StatusChip from "../StatusChip";
import MoreOption from "@/components/MoreOption";
import {
  ShippingListContainerSizeContext,
  actionMenu,
} from "@/pages/projects/shipping-list";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";

const ListView = ({
  isLoading,
  data,
  onClickAction,
}: {
  onClickAction?: (key?: any, row?: any) => void;
  isLoading?: boolean;
  data?: any;
}) => {
  const router = useRouter();
  const containerSize: any = useContext(ShippingListContainerSizeContext);

  return (
    <div className="overflow-x-auto flex-inline">
      <table className="w-full">
        <thead>
          <tr>
            <TH className="ps-4">Shipping No.</TH>
            <TH>Invoice To</TH>
            <TH>Delivery To</TH>
            <TH>Added By</TH>
            <TH>Furnace</TH>
            <TH className="w-[200px]">Delivery Date</TH>
            <TH>Status</TH>
            <TH className="text-right pe-4">Actions</TH>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            [0, 0, 0, 0, 0, 0, 0].map((item: any, key: number) => (
              <tr key={key}>
                <td className="py-3 ps-4 pe-2 align-top">
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
                <td className="py-3 px-2 align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
                <td className="py-3 px-2 align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
                <td className="py-3 px-2 align-top">
                  <Skeleton className="w-12 h-12 rounded-full" />
                </td>
                <td className="py-3 px-2 align-top">
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
                <td className="py-3 px-2 align-top">
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
                <td className="py-3 px-2 align-top" colSpan={2}>
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
              </tr>
            ))}
          {data &&
            Array.isArray(data.shipping) &&
            data.shipping.map((row: any, key: number) => (
              <tr key={key} className="group">
                <TD className="ps-4 align-top">
                  <Link href={`${router.pathname}/${row._shipping_id}`}>
                    <span className="text-blue-600 font-medium">
                      {row.shipping_number}
                    </span>
                  </Link>
                </TD>
                <TD className="align-top w-[350px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm uppercase">
                      {row.supplier}
                    </span>
                    <span className="text-sm text-stone-500">
                      {addressFormat(
                        row.supplier_address_building,
                        row.supplier_address_street,
                        row.supplier_address_city,
                        row.supplier_address_country
                      )}
                    </span>
                  </div>
                </TD>
                <TD className="align-top w-[350px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm uppercase">
                      {row.client}
                    </span>
                    <span className="text-sm text-stone-500">
                      {addressFormat(
                        row.cms_address_building,
                        row.cms_address_street,
                        row.cms_address_city,
                        row.cms_address_country
                      )}
                    </span>
                  </div>
                </TD>
                <TD className="align-top">
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger>
                        <AvatarProfile
                          firstname={row.user_firstname}
                          lastname={row.user_lastname}
                          photo={baseUrl + "/users/thumbnail/" + row.user_photo}
                          avatarClassName="w-10 h-10"
                          avatarColor={row.avatar_color}
                          avatarFallbackClassName="font-medium text-white text-xs"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {(row.user_firstname || "N") +
                            " " +
                            (row.user_lastname || "A")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row.shipping_furnace || "--"}
                  </span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row.shipping_delivery_date || "--"}
                  </span>
                </TD>
                <TD className="align-top">
                  <StatusChip status={row.shipping_status} />
                </TD>
                <TD className="align-top text-right pe-4 sticky right-[10px] z-10">
                  <MoreOption contentClassName="w-[170px] ">
                    {[...actionMenu].map((action, key) => (
                      <>
                        {key === 2 && <Separator className="my-2" />}

                        {key === 5 && <Separator className="my-2" />}

                        <ItemMenu
                          key={key}
                          className="flex gap-3 items-center"
                          onClick={() =>
                            onClickAction && onClickAction(key, row)
                          }
                        >
                          {action.icon}
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </ItemMenu>
                      </>
                    ))}
                  </MoreOption>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
