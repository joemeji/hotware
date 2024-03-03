import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { memo, useState } from "react";
import { ArrowLeft, ListFilter } from "lucide-react";
import useSWR from "swr";
import { baseUrl, fetcher } from "@/utils/api.config";
import AvatarProfile from "@/components/AvatarProfile";

type LoadingDetailsModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  loading?: any;
};

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const LoadingDetailsModal = ({
  open,
  onOpenChange,
  loading,
}: LoadingDetailsModal) => {
  const [scrollHeaderHeight, setScrollHeaderHeight] = useState<any>(0);

  const { data, isLoading, error } = useSWR(
    "/api/loading-list/" + loading.loading_id + "/details",
    fetcher,
    swrOptions
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[400px] bg-stone-50 p-0 border-0">
        <div
          className="py-3 px-4 items-center flex justify-between border-b border-b-stone-200/70"
          ref={(el) => setScrollHeaderHeight(el?.offsetHeight)}
        >
          <div className="flex items-center gap-2">
            <button
              className="w-fit p-1 rounded-full bg-stone-100 hover:bg-stone-200"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              <ArrowLeft />
            </button>
            <span className="text-base font-medium">Loading Details</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-2">
          <div className="rounded-xl border-2 border-stone-200 p-3 flex justify-between gap-4">
            <div className="text-sm flex justify-between flex-col">
              <p className="text-stone-600">Created at</p>
              <p>{formatDate(data && data)}</p>
            </div>
            <div className="flex gap-1 flex-col">
              <p className="text-stone-600">Added by</p>
              <div className="flex gap-1 items-center">
                <AvatarProfile
                  firstname={data && data.user_firstname}
                  lastname={data && data.user_lastname}
                  photo={
                    baseUrl + "/users/thumbnail/" + data && data?.user_photo
                  }
                  avatarClassName="w-7 h-7"
                  avatarColor={data && data.avatar_color}
                  avatarFallbackClassName="font-medium text-white text-xs"
                />
                <p className="font-medium">{data && data.added_by_name}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
            <div>
              <p className="text-stone-600">Description</p>
            </div>
            <div>
              <p className="font-medium">{data && data.loading_description}</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
            <div>
              <p className="text-stone-600">Furnace</p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium">{data && data.loading_furnace}</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
            <div>
              <p className="text-stone-600">Work</p>
            </div>
            <div>
              <p className="font-medium">{data && data.loading_work}</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
            <div>
              <p className="text-stone-600">Type of Unit</p>
            </div>
            <div>
              <p className="font-medium">{data && data.loading_type_of_unit}</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
            <div>
              <p className="text-stone-600">Additional Notes</p>
            </div>
            <div>
              <p className="font-medium">
                {data && data.loading_additional_notes}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default memo(LoadingDetailsModal);

const formatDate = (data: any) => {
  if (!data || !data.added_date) {
    return "Invalid Date";
  }

  const year = parseInt(data.added_date.substring(0, 4));
  const month = parseInt(data.added_date.substring(4, 6)) - 1;
  const day = parseInt(data.added_date.substring(6, 8));
  const hour = parseInt(data.added_date.substring(8, 10));
  const minute = parseInt(data.added_date.substring(10, 12));
  const second = parseInt(data.added_date.substring(12, 14));

  // Create a Date object
  const formattedDate = new Date(
    year,
    month,
    day,
    hour,
    minute,
    second
  ).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formattedDate;
};
