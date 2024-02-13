import CategorySelect from "@/components/CategorySelect";
import ItemSelect from "@/components/ItemSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { LayoutGrid, ListChecks, Search } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import useSize from "@/hooks/useSize";

const ItemBlockSelect = React.forwardRef(
  (
    {
      height = 300,
      className,
      selectedItems,
      onSelectItems,
    }: {
      height?: number;
      className?: any;
      selectedItems?: any;
      onSelectItems?: (items?: any) => void;
    },
    ref: any
  ) => {
    const access_token: any = useContext(AccessTokenContext);
    const headerRef = useRef(null);
    const headerSize: any = useSize(headerRef);
    const [tab, setTab] = useState<"item" | "category">("item");
    const [categoryId, setCategoryId] = useState(null);
    const [subCategoryId, setSubCategoryId] = useState(null);

    const onSelectInfo = (category: any) => {
      if (typeof category?.item_category_name !== "undefined") {
        setCategoryId(category._item_category_id);
        setSubCategoryId(null);
      }
      if (typeof category?.item_sub_category_id !== "undefined") {
        setSubCategoryId(category.item_sub_category_id);
        setCategoryId(null);
      }
      setTab("item");
    };

    return (
      <div style={{ height: height + "px" }} ref={ref} className={className}>
        <div ref={headerRef} className="flex flex-col shadow-sm pb-2">
          <form className={cn("w-full py-2 pt-0 px-2")}>
            <div className="bg-stone-100 flex items-center rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
              <Search className="text-stone-400 w-5 h-5" />
              <input
                placeholder="Search"
                className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full"
                name="search"
              />
            </div>
          </form>

          <div className="flex gap-1 px-2">
            <button
              className={cn(
                "flex items-center bg-stone-100 rounded-full py-1 px-3 gap-2 font-medium pe-4",
                tab === "category" && "bg-stone-800 text-white"
              )}
              onClick={() => setTab("category")}
            >
              <LayoutGrid className="w-[17px]" /> Categories
            </button>
            <button
              className={cn(
                "flex items-center bg-stone-100 rounded-full py-1 px-3 gap-2 font-medium pe-4",
                tab === "item" && "bg-stone-800 text-white"
              )}
              onClick={() => {
                setTab("item");
                setSubCategoryId(null);
                setCategoryId(null);
              }}
            >
              <ListChecks className="w-[17px]" /> Items
            </button>
          </div>
        </div>

        {tab === "item" && (
          <div className="w-full">
            <ItemSelect
              access_token={access_token}
              itemClassName={"ps-3 py-2 rounded-none"}
              scrollViewPortStyle={{
                height: `${height - headerSize?.height - 9}px`,
              }}
              scrollViewPortClassName={"pb-3"}
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              // multiple={false}
              onSelectItems={onSelectItems}
              selectedItems={selectedItems}
              disabledInfiniteScrolling={true}
              withInventory={false}
              withLabel={false}
            />
          </div>
        )}

        {tab === "category" && (
          <div className="w-full">
            <ScrollArea
              viewPortStyle={{
                height: `${height - headerSize?.height - 9}px`,
              }}
            >
              <CategorySelect
                access_token={access_token}
                onSelectedInfo={onSelectInfo}
              />
            </ScrollArea>
          </div>
        )}
      </div>
    );
  }
);

ItemBlockSelect.displayName = "ItemBlockSelect";

export default ItemBlockSelect;
