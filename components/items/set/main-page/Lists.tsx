import { memo, useEffect, useRef, useState } from "react";
import AvatarProfile from "@/components/AvatarProfile";
import { TH, TD } from "@/components/items";
import { Button } from "@/components/ui/button";
import { LayoutList } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWR from "swr";
import { baseUrl, fetcher } from "@/utils/api.config";
const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};
export const Lists = ({ access_token }: any) => {
  const { data, isLoading, error } = useSWR(
    `/api/item/set`,
    fetcher,
    swrOptions
  );

  return (
    <table className="w-full">
      <thead className="sticky top-0">
        <tr>
          <TH className="ps-4 w-[50px]">Image</TH>
          <TH className="ps-4">Name</TH>
          <TH className="ps-4">Hs Code</TH>
          <TH className="ps-4">Total Weight</TH>
          <TH className="ps-4">Number of Equipments</TH>
          <TH className="ps-4">S/N ?</TH>
          <TH className="ps-4">Added By</TH>
          <TH className="ps-4 text-right pe-5">Actions</TH>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((item: any, i: any) => (
            <tr key={i}>
              <TD className="font-medium align-top">
                <Image
                  src={baseUrl + "/storage/sets/" + item.item_set_image}
                  alt="Test Alt"
                  className="rounded-app"
                  width={60}
                  height={60}
                />
                {/* <img
                  //src={item.item_set_image}
                  src={baseUrl + "/storage/sets/" + item.item_set_image}
                  alt="Test Alt"
                  className="rounded-app"
                  width={60}
                  height={60}
                /> */}
              </TD>
              <TD className="font-medium">{item.item_set_name}</TD>
              <TD className="font-medium">{item.item_set_hs_code}</TD>
              <TD className="font-medium">{item.item_set_total_weight}</TD>
              <TD className="font-medium">{item.number_of_equipments}</TD>
              <TD className="font-medium">
                {item.with_serial > 0 ? "Yes" : "No"}
              </TD>
              <TD className="font-medium">
                <TooltipProvider delayDuration={400}>
                  <Tooltip>
                    <TooltipTrigger>
                      <AvatarProfile
                        firstname={item.user_firstname}
                        lastname={item.user_lastname}
                        photo={baseUrl + "/users/thumbnail/" + item.user_photo}
                        avatarClassName="w-10 h-10"
                        avatarColor={item.avatar_color}
                        avatarFallbackClassName="font-medium text-white text-xs"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {(item.user_firstname || "N") +
                          " " +
                          (item.user_lastname || "A")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TD>
              <TD className="text-right pe-5">
                <Button className="p-2.5 rounded-full" variant="secondary">
                  <LayoutList className="w-[18px] h-[18px]" />
                </Button>
              </TD>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
