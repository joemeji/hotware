import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import { memo, useContext } from "react";
import useSWR from "swr";

const ReminderDay = ({
  reminder_no,
  onValueChangeSwitch,
  switchValues,
  onDayChange,
  dayValue,
}: ReminderDay) => {
  const access_token = useContext(AccessTokenContext);

  const { data, isLoading, error } = useSWR(
    [`/api/administrative_reminder/all`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[100px] h-[15px]" />
          <Skeleton className="w-[60px] h-[15px]" />
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Days</label>
            <div>
              <Input
                className="bg-stone-100 border-0"
                type="number"
                placeholder="Days"
                onChange={onDayChange}
                value={dayValue}
                name={`reminder_${reminder_no}_days`}
                // error={errors && (errors.shipping_item_name ? true : false)}
                // {...register("shipping_item_name")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-5 ms-1">
            {Array.isArray(data) &&
              data.map((item: any, key: number) => {
                const ext = `${item.administrative_reminder_initial}_${item.administrative_reminder_id}`;
                const name = `reminder_${reminder_no}_${ext}`;

                return (
                  <div className="flex items-center gap-3" key={key}>
                    <Switch
                      className="h-[18px] w-[36px]"
                      thumbClassName="w-[12px] h-[12px]"
                      name={ext}
                      onCheckedChange={(checked) =>
                        onValueChangeSwitch &&
                        onValueChangeSwitch(checked, item)
                      }
                      checked={switchValues ? switchValues[name] : false}
                    />
                    <label className="font-medium text-base">
                      {item.administrative_reminder_initial}
                    </label>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

type ReminderDay = {
  reminder_no?: number;
  onValueChangeSwitch?: (checked: any, item: any) => void;
  switchValues?: any;
  onDayChange?: (e: any) => void;
  dayValue?: any;
};

export default memo(ReminderDay);
