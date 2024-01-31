import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Separator } from "@/components/ui/separator";
import { addressFormat } from "@/lib/shipping";
import { actionMenu } from "@/pages/projects/shipping-list";
import StatusChip from "../StatusChip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import { baseUrl } from "@/utils/api.config";

export default function ListView({
  isLoading,
  data,
  onClickAction,
}: {
  onClickAction?: (key?: any, row?: any) => void;
  isLoading?: boolean;
  data?: any;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {Array.isArray(data?.shipping) &&
          data.shipping.map((row: any, key: number) => (
            <ListDetails key={key} row={row} />
          ))}
      </div>
    </>
  );
}

const ListDetails = ({
  row,
  onClickAction,
}: {
  row?: any;
  onClickAction?: any;
}) => {
  return (
    <div className="bg-white rounded-app shadow-sm px-2 pb-3">
      <div className="w-full gap-2 flex items-center justify-between border-b pt-3 pb-2">
        <span className="font-medium text-base text-blue-600">
          {row.shipping_number}
        </span>
        <MoreOption contentClassName="w-[170px] ">
          {[...actionMenu].map((action, key) => (
            <>
              {key === 2 && <Separator className="my-2" />}

              {key === 5 && <Separator className="my-2" />}

              <ItemMenu
                key={key}
                className="flex gap-3 items-center"
                onClick={() => onClickAction && onClickAction(key, row)}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.name}</span>
              </ItemMenu>
            </>
          ))}
        </MoreOption>
      </div>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="align-top w-[120px] border-b border-stone-100 py-2">
              Invoice To
            </td>
            <td className="align-top text-left border-b border-stone-100 py-2 ">
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
            </td>
          </tr>

          <tr>
            <td className="align-top w-[120px] border-b border-stone-100 py-2">
              Deliver To
            </td>
            <td className="align-top text-left border-b border-stone-100 py-2">
              <div className="flex flex-col">
                <span className="font-medium text-sm uppercase">
                  {row.supplier}
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
            </td>
          </tr>

          <tr>
            <td className="align-top w-[120px] border-b border-stone-100 py-2">
              Furnace
            </td>
            <td className="align-top text-left border-b border-stone-100 py-2">
              {row.shipping_furnace || "--"}
            </td>
          </tr>

          <tr>
            <td className="align-top w-[120px] border-b border-stone-100 py-2">
              Delivery Date
            </td>
            <td className="align-top text-left border-b border-stone-100 py-2">
              <span className="font-medium">
                {row.shipping_delivery_date || "--"}
              </span>
            </td>
          </tr>

          <tr>
            <td className="align-top w-[120px] border-b border-stone-100 py-2">
              Status
            </td>
            <td className="align-top text-left border-b border-stone-100 py-2">
              <StatusChip status={row.shipping_status} />
            </td>
          </tr>

          <tr>
            <td className="align-top w-[120px] py-2 pb-0">Added By</td>
            <td className="align-top text-left py-2 pb-0">
              <div className="flex gap-2 items-center">
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
                <span className="font-medium">
                  {row.user_firstname || ""} {row.user_lastname || ""}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
