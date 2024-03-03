import CategorySelect from "@/components/CategorySelect";
import ItemSelect from "@/components/ItemSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { LayoutGrid, ListChecks, Search } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import useSize from "@/hooks/useSize";
import SearchInput from "./search-input";

const ItemBlockSelect = React.forwardRef(
  (
    {
      height = 300,
      className,
      selectedItems,
      onSelectItems,
      multiple = true,
    }: {
      height?: number;
      className?: any;
      selectedItems?: any;
      multiple?: boolean;
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
    const [search, setSearch] = useState("");

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
            <SearchInput
              width={400}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              delay={500}
            />
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
              multiple={multiple}
              onSelectItems={onSelectItems}
              selectedItems={selectedItems}
              disabledInfiniteScrolling={true}
              withInventory={false}
              withLabel={false}
              search={search}
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
