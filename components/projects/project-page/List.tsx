import MoreOption from "@/components/MoreOption";
import { UserAvatar } from "@/components/documents/employees/list";
import { ItemMenu, TD, TH } from "@/components/items";
import { AccessTokenContext } from "@/context/access-token-context";
import { status } from "@/lib/project";
import { cn } from "@/lib/utils";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { Eye, FilePlus, Pencil, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import useSWR from "swr";

const List = () => {
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const urlPayload: any = {};

  let searchParams = new URLSearchParams(urlPayload);
  const { data, isLoading, error } = useSWR(
    [`/api/projects?${searchParams.toString()}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const address = (row: any) => {
    let rows = [
      row.cms_address_building || null,
      row.cms_address_street || null,
      row.cms_address_city || null,
      row.cms_address_zip || null,
      row.country_cms_address_country || null,
    ];
    return rows.filter((loc: any) => loc !== null).join(", ");
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <TH className="ps-4 font-medium w-[70px]">Project #</TH>
          <TH className="ps-4 font-medium w-[300px]">Client</TH>
          <TH className="font-medium w-[200px]">Project Name</TH>
          <TH className="font-medium">Manpower</TH>
          <TH className="font-medium">Date</TH>
          <TH className="font-medium">Start Date</TH>
          <TH className="font-medium">End Date</TH>
          <TH className="font-medium">Delivery Date</TH>
          <TH className="font-medium">Added By</TH>
          <TH className="font-medium">Status</TH>
          <TH className="text-right pe-4"></TH>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data?.projects) &&
          data.projects.map((row: any, key: number) => (
            <tr key={key} className="hover:bg-stone-100">
              <TD className="align-top ps-4">
                <span className="font-medium">{row.project_number}</span>
              </TD>
              <TD className="align-top">
                <div className="flex flex-col">
                  <Link
                    href=""
                    className="font-medium hover:underline text-blue-700 w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                    title={row.cms_name}
                  >
                    {row.cms_name}
                  </Link>
                  <span
                    title={address(row)}
                    className="w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {address(row)}
                  </span>
                </div>
              </TD>

              <TD className="align-top">
                <div className="flex">
                  <span
                    title={row.project_name}
                    className="w-[250px] whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                  >
                    {row.project_name}
                  </span>
                </div>
              </TD>
              <TD className="align-top">{row.project_man_power}</TD>
              <TD className="align-top">{row.added_date}</TD>
              <TD className="align-top">
                {row.project_start_date ? row.project_start_date : ""}
              </TD>
              <TD className="align-top">
                {row.project_end_date ? row.project_end_date : ""}
              </TD>
              <TD className="align-top">
                {row.project_delivery_date ? row.project_delivery_date : ""}
              </TD>
              <TD className="align-top">
                <UserAvatar
                  firstname={row.user_firstname}
                  lastname={row.user_lastname}
                  avatar_color={row.avatar_color}
                  photo={row.user_photo}
                />
              </TD>
              <TD className="align-top">
                <StatusChip status={row.project_status} />
              </TD>
              <TD>
                <MoreOption>
                  <ItemMenu className="gap-3">
                    <Eye className="w-[18px] h-[18px] text-blue-600" />
                    <span className="font-medium">View</span>
                  </ItemMenu>
                  <ItemMenu className="gap-3">
                    <Pencil className="w-[18px] h-[18px] text-orange-600" />
                    <span className="font-medium">Update</span>
                  </ItemMenu>
                  <ItemMenu className="gap-3">
                    <FilePlus className="w-[18px] h-[18px] text-purple-600" />
                    <span className="font-medium">Change Shipping List</span>
                  </ItemMenu>
                  <ItemMenu className="gap-3">
                    <Settings2 className="w-[18px] h-[18px] text-green-600" />
                    <span className="font-medium">Change Status</span>
                  </ItemMenu>
                </MoreOption>
              </TD>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default memo(List);

export const StatusChip = memo(({ status: statusName }: { status: any }) => {
  const _status = status[statusName];
  return (
    <div
      className={cn(
        "bg-[var(--bg-hover)] text-white w-fit px-3 py-[2px] rounded-full",
        "font-medium",
        "flex items-center"
      )}
      ref={(el) => {
        el?.style.setProperty("--bg-hover", `rgb(${_status?.color})`);
      }}
    >
      {_status?.name}
    </div>
  );
});

StatusChip.displayName = "StatusChip";
