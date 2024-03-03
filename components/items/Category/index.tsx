import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import React, { memo, useContext } from "react";
import CategoryList from "./CategoryList";
import { MainCategoryContext } from "@/pages/items";

const Categories = () => {
  const router = useRouter();
  const categoryId = router.query?.category_id;
  const { main_categories } = useContext(MainCategoryContext);

  return (
    <div className={cn("w-[400px]")}>
      <ScrollArea
        viewPortClassName="bg-white h-[calc(100vh-var(--header-height)-40px)] rounded-xl shadow"
        className="py-0"
      >
        <span
          className={cn(
            "text-lg h-[60px] flex items-center px-3 sticky top-0",
            "backdrop-blur-sm bg-white/40 z-[1] font-medium"
          )}
        >
          Filter by Categories
        </span>
        {main_categories &&
          main_categories.map((item: any, key: number) => (
            <React.Fragment key={key}>
              <div className="p-3 back">
                <span className="text-stone-500 flex mb-2 ms-1">
                  {item.item_main_category_name}
                </span>
                <ul className="flex flex-col rounded-md gap-1">
                  {item.categories &&
                    item.categories.map((catItem: any, key2: number) => (
                      <CategoryList
                        key={key2}
                        categoryId={categoryId}
                        _item_category_id={catItem._item_category_id}
                        item_category_name={catItem.item_category_name}
                        sub_categories={catItem.sub_categories}
                      />
                    ))}
                </ul>
              </div>
              {main_categories.length > key + 1 && <Separator />}
            </React.Fragment>
          ))}
      </ScrollArea>
    </div>
  );
};

export default memo(Categories);
