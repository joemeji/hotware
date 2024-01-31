import { fetchApi, fetcher } from "@/utils/api.config";
import { memo, useContext, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingMore from "@/components/LoadingMore";
import { LoadingListDetailsContext } from "@/pages/projects/loading-list";
import { useSession } from "next-auth/react";

const ItemSetSelect = (props: ItemSetSelectProps) => {
  const { data: session }: any = useSession();
  const { selectedItems, onSelectItems, minHeight, maxHeight, access_token } = props;
  const loadingListDetail: any = useContext(LoadingListDetailsContext);
  const loading_id = loadingListDetail ? loadingListDetail.loading_id : null;

  const { data, isLoading, error, size, setSize, isValidating } = useSWRInfinite(
    (index) => {
      let paramsObj: any = {};
      paramsObj['page'] = index + 1;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        !open ? null : `/api/items/sets?${searchParams.toString()}`,
        session?.user?.access_token
      ];
    },
    fetchApi
  );

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onCheckItemId = (isChecked: boolean, item: any) => {
    const _selectedItems = selectedItems ? [...selectedItems] : [];
    const selectedItemIdIndex = _selectedItems.findIndex((data: any) => data.item_set_id === item.item_set_id);
    if (selectedItemIdIndex > -1 && !isChecked) _selectedItems.splice(selectedItemIdIndex, 1);
    else _selectedItems.push({ ...item, isSelected: false });
    onSelectItems && onSelectItems(_selectedItems);
  };

  const getSingleSelectedItem = (item_set_id: string | any) => {
    const _selectedItem = selectedItems ? selectedItems.find((data: any) => data.item_set_id === item_set_id) : null;
    if (!_selectedItem) return null;
    return _selectedItem;
  };

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  }

  return (
    <>
      <div className="px-3 py-2">
        <div className="bg-stone-100 flex items-center w-full rounded-xl overflow-hidden px-2 h-10">
          <Search className="text-gray-400 w-5 h-5" />
          <input placeholder="Search"
            className={cn(
              "border-0 rounded-none outline-none text-sm w-full px-2 bg-transparent h-full",
            )}
            name="search"
          />
        </div>
      </div>
      <ScrollArea className="min-h-[400px] max-h-[60vh]" onScrollEndViewPort={onscrollend}
        style={{
          minHeight,
          maxHeight
        }}
      >
        <div className="flex flex-col px-3 gap-1">
          {_data && Array.isArray(_data) && _data.map((data: any) => {
            return data && Array.isArray(data.sets) && data.sets.map((item: any, key: number) => (
              <label htmlFor={item.item_set_id}
                key={key}
                className={cn(
                  "flex justify-between align-items-center px-3 py-3 rounded-xl",
                  "items-center hover:bg-stone-100 cursor-pointer",
                  getSingleSelectedItem(item.item_set_id) && 'bg-stone-100',
                  item.selected && 'pointer-events-none opacity-50'
                )}
              >
                <div className="flex gap-2">
                  <div className="w-[15px] h-[15px] rounded-full bg-purple-300 mt-1" />
                  <div className="flex gap-1 flex-col">
                    <p className="font-medium">{item.item_set_name}</p>
                    <span>S.{item.item_set_id}</span>
                  </div>
                </div>
                <Checkbox
                  id={item.item_set_id}
                  className="rounded-full h-5 w-5 border-stone-300 bg-stone-300"
                  onCheckedChange={(isChecked: boolean) => onCheckItemId(isChecked, item)}
                  checked={getSingleSelectedItem(item.item_set_id) ? getSingleSelectedItem(item.item_set_id).item_set_id === item.item_set_id : false}
                />
              </label>
            ))
          })}
        </div>
        {isLoadingMore && (
          <LoadingMore />
        )}
      </ScrollArea>
    </>
  );
};

export default memo(ItemSetSelect);

type ItemSetSelectProps = {
  selectedItems?: any[]
  onSelectItems?: (items: any[]) => void
  minHeight?: string
  maxHeight?: string,
  access_token?: any
}