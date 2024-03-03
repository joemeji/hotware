import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useCallback, useEffect, useState } from "react";

const CategoryList = ({
  categoryId,
  _item_category_id,
  item_category_name,
  sub_categories: _sub_categories,
}: any) => {
  const router = useRouter();
  const sub_category_id = router.query.sub_category_id;
  const [sub_categories, set_sub_categories] = useState<any>([]);
  const [openSub, setOpenSub] = useState(false);
  const [ulHeight, setUlHeight] = useState(0);

  const onShowSubCategories = useCallback(() => {
    let liHeights = 0;
    if (sub_categories && Array.isArray(sub_categories)) {
      sub_categories.forEach((li: any) => {
        const liElem = li.listRef.current;
        if (liElem) {
          const { height } = liElem.getBoundingClientRect();
          liHeights += height;
        }
      });
    }
    setUlHeight(liHeights);
  }, [sub_categories]);

  useEffect(() => {
    const sub_category = Array.isArray(sub_categories)
      ? sub_categories.find(
          (sub: any) => sub.item_sub_category_id === sub_category_id
        )
      : null;
    onShowSubCategories();
    if (categoryId === _item_category_id || sub_category) {
      setOpenSub(true);
    } else {
      setOpenSub(false);
    }
  }, [
    sub_categories,
    categoryId,
    _item_category_id,
    onShowSubCategories,
    sub_category_id,
  ]);

  useEffect(() => {
    if (_sub_categories) {
      const __sub_categories = _sub_categories.map((sub: any) => {
        return {
          ...sub,
          listRef: React.createRef<HTMLLIElement>(),
        };
      });
      set_sub_categories(__sub_categories);
    }
  }, [_sub_categories]);

  return (
    <li className="flex relative flex-col">
      <button
        className="hover:bg-stone-300 absolute left-0 top-1.5 rounded-full p-0.5"
        onClick={() => {
          onShowSubCategories();
          setOpenSub(!openSub);
        }}
      >
        <ChevronRight
          width={25}
          height={25}
          className={cn(
            "rotate-0 transition-transform duration-300",
            openSub && "rotate-90"
          )}
        />
      </button>
      <Link
        href={"/items?category_id=" + _item_category_id}
        className={cn(
          "ps-8 w-full px-3 py-2.5 font-medium flex justify-between",
          "items-center hover:bg-stone-200 rounded-xl",
          openSub && "rounded-br-none rounded-bl-none",
          (openSub || categoryId === _item_category_id) && "bg-stone-100"
        )}
      >
        {item_category_name}
      </Link>
      {Array.isArray(sub_categories) && sub_categories.length > 0 && (
        <ul
          className={cn(
            "overflow-hidden transition-[height] duration-300",
            "bg-stone-100 rounded-b-xl ps-3 pe-2"
          )}
          style={{ height: openSub ? ulHeight + "px" : 0 }}
        >
          {sub_categories.map((sub: any, key: number) => (
            <li key={key} ref={sub.listRef}>
              <Link
                href={"/items/?sub_category_id=" + sub.item_sub_category_id}
                className={cn(
                  "w-full px-3 py-2 flex justify-between ps-5",
                  "items-center hover:bg-stone-200",
                  "rounded-xl",
                  sub.item_sub_category_id === sub_category_id && "bg-stone-200"
                )}
              >
                {sub.item_sub_category_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default memo(CategoryList);
