import LoadingMore from "@/components/LoadingMore";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { fetcher } from "@/utils/api.config";
import { Eye, Search } from "lucide-react";
import useSWRInfinite from "swr/infinite";

type LoadingList = {
  value?: any
  onValueChange?: (value: any) => void
}

export default function LoadingList({ value, onValueChange }: LoadingList) {
  const { data, isLoading, error, size, setSize, isValidating } =
  useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    let searchParams = new URLSearchParams(paramsObj);
    return `/api/loading-list?${searchParams.toString()}`;
  }, fetcher);

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  return (
    <>
      <div className="px-3 py-2">
        <div className="bg-stone-100 flex items-center w-full rounded-xl overflow-hidden px-2 h-10">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            placeholder="Search"
            className={cn(
              "border-0 rounded-none outline-none text-sm w-full px-2 bg-transparent h-full"
            )}
            name="search"
          />
        </div>
      </div>

      <ScrollArea
        viewPortClassName="min-h-[400px] max-h-[600px]"
        onScrollEndViewPort={onscrollend}
      >
        <RadioGroup className="px-3 gap-0" onValueChange={onValueChange} value={value}>
          {_data &&
            Array.isArray(_data) &&
            _data.map((data: any) => {
              return (
                data &&
                Array.isArray(data.list) &&
                data.list.map((item: any, key: number) => (
                  <div
                    key={key}
                    className='flex items-start gap-3 py-3 px-2 rounded-sm hover:bg-stone-100 [&:has(button[data-state="checked"])]:bg-stone-200/80 justify-between'
                  >
                    <div className="flex items-start" id={item.loading_id}>
                      <RadioGroupItem
                        className="border-primary/20 cursor-pointer me-[10px] mt-[3px]"
                        value={item.loading_id}
                        id={"id" + item.loading_id}
                      />
                      <label
                        className="cursor-pointer font-medium"
                        htmlFor={"id" + item.loading_id}
                      >
                        {item.loading_description}
                      </label>
                    </div>
                    {/* <MoreOption>
                      <ItemMenu className="font-medium">
                        <Eye
                          className={cn("mr-2 h-[18px] w-[18px]")}
                          strokeWidth={1.5}
                        />
                        View Items
                      </ItemMenu>
                    </MoreOption> */}
                  </div>
                ))
              );
            })}
        </RadioGroup>
        {isLoadingMore && <LoadingMore />}
      </ScrollArea>
    </>
  )
}