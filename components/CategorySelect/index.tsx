import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { PopoverTrigger } from "../ui/popover";

function CategorySelect(props: CategorySelectProps) {
  const { data: session }: any = useSession();
  const { access_token, onSelect, selected, onSelectedInfo } = props;
  const [definedCategories, setDefinedCategories] = useState<any>([]);

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data: categories, isLoading: categoryIsLoading } = useSWR(
    ["/api/categories/all", access_token ?? session?.user?.access_token],
    fetchApi,
    swrOptions
  );

  const _onClickCategory = (category: any) => {
    if (onSelect) {
      if (typeof category._item_category_id !== "undefined")
        onSelect(category._item_category_id);
      if (typeof category.item_sub_category_id !== "undefined")
        onSelect(category.item_sub_category_id);
    }
    onSelectedInfo && onSelectedInfo(category);
  };

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      const _categories: any = categories.map(
        (mainCategory: MainCategoryType) => {
          mainCategory.categories = mainCategory.categories?.map(
            (category: CategoryType) => {
              category.sub_categories = category.sub_categories?.map(
                (sub: SubCategoryType) => {
                  return {
                    ...sub,
                    subRef: React.createRef(),
                  };
                }
              );
              return category;
            }
          );
          return mainCategory;
        }
      );
      setDefinedCategories(_categories);
    }
  }, [categories]);

  if (categoryIsLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-[60%] h-[15px]" />
        <Skeleton className="w-[20%] h-[15px]" />
      </div>
    );
  }

  return (
    <ul className="p-3 flex gap-2 flex-col">
      {definedCategories &&
        Array.isArray(definedCategories) &&
        definedCategories.map(
          (mainCategory: MainCategoryType, mainIndex: number) => (
            <li key={mainIndex}>
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-600">
                  {mainCategory.item_main_category_name}
                </span>
              </div>
              {mainCategory.categories &&
                Array.isArray(mainCategory.categories) && (
                  <ul className="ps-1 flex flex-col gap-1 border-l">
                    {mainCategory.categories.map(
                      (category: CategoryType, index: number) => (
                        <Category
                          key={index}
                          category={category}
                          onClickCategory={_onClickCategory}
                          selected={selected}
                        />
                      )
                    )}
                  </ul>
                )}
            </li>
          )
        )}
    </ul>
  );
}

CategorySelect.displayName = "CategorySelect";

export default memo(CategorySelect);

function Category({
  category,
  onClickCategory,
  selected,
}: {
  category: CategoryType;
  onClickCategory: (categoryId: any) => void;
  selected?: any;
}) {
  const [totalHeight, setTotalHeight] = useState(0);
  const [open, setOpen] = useState(false);

  const onOpenCategoryLists = () => {
    let totalHeight = 0;

    if (
      category &&
      category.sub_categories &&
      Array.isArray(category.sub_categories)
    ) {
      category.sub_categories.forEach((sub: SubCategoryType) => {
        const { current } = sub.subRef;
        const rect: any = current.getBoundingClientRect();
        totalHeight += rect.height;
      });
    }

    setTotalHeight(totalHeight + 13);
    setOpen(!open);
  };

  const CategoryButton = React.forwardRef(({ category }: any, ref: any) => {
    return (
      <>
        <div
          tabIndex={0}
          className="py-2 px-3 cursor-pointer rounded-t-xl"
          onClick={() => onClickCategory(category)}
        >
          <span className="font-medium ">{category.item_category_name}</span>
        </div>
        <button
          className={cn(
            "absolute hover:bg-stone-200 top-1 right-1 rounded-xl p-1",
            (open || selected === category._item_category_id) && "visible"
          )}
          onClick={() => onOpenCategoryLists()}
        >
          <ChevronDown
            strokeWidth={1}
            className={cn("text-stone-500", open && "-rotate-180")}
          />
        </button>
      </>
    );
  });

  CategoryButton.displayName = "CategoryButton";

  const SubCategoryButton = React.forwardRef(({ sub }: any, ref: any) => {
    return (
      <button
        ref={ref}
        className={cn(
          "hover:bg-stone-200 w-full text-left py-2 px-3 pe-0 rounded-xl text-stone-600 flex",
          selected === sub.item_sub_category_id && "bg-stone-200"
        )}
        onClick={() => onClickCategory(sub)}
      >
        {sub.item_sub_category_name}
        <ChevronRight
          className="w-[20px] ms-auto text-stone-600"
          strokeWidth={1}
        />
      </button>
    );
  });

  SubCategoryButton.displayName = "SubCategoryButton";

  return (
    <li
      className={cn(
        "relative rounded-xl hover:bg-stone-100 group",
        (open || selected === category._item_category_id) && "bg-stone-100"
      )}
    >
      <CategoryButton category={category} />
      {category.sub_categories && Array.isArray(category.sub_categories) && (
        <ul
          className="px-3 flex flex-col transition-all duration-200 overflow-hidden"
          style={{
            height: open ? totalHeight + "px" : 0,
            paddingTop: !open ? 0 : "3px",
            paddingBottom: !open ? 0 : "10px",
          }}
        >
          {category.sub_categories.map(
            (sub: SubCategoryType, index: number) => (
              <li key={index} className="flex" ref={sub.subRef}>
                <SubCategoryButton sub={sub} />
              </li>
            )
          )}
        </ul>
      )}
    </li>
  );
}

Category.displayName = "Category";

type CategorySelectProps = {
  access_token: string;
  onSelect?: (categoryId: any) => void;
  selected?: any;
  onSelectedInfo?: (category: any) => void;
};

type MainCategoryType = {
  categories?: any[];
  item_main_category_id: string | number;
  item_main_category_name: string;
};

type CategoryType = {
  sub_categories?: any[];
  item_category_id: string | number;
  item_category_name: string;
  item_category_prefix: string;
  _item_category_id: string;
};

type SubCategoryType = {
  item_sub_category_id: string | number;
  item_sub_category_index: string;
  item_sub_category_name: string;
  subRef?: any;
};
