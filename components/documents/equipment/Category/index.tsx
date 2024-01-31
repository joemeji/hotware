import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import React, { memo, useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import useSWR from "swr";
import { AccessTokenContext } from "@/context/access-token-context";
import { baseUrl, fetchApi } from "@/utils/api.config";
import Image from "next/image";
import { SelectedEquipmentContext } from "@/pages/documents/equipment";

const Categories = (props: categoryProps) => {
  const selectedEquipment = useContext(SelectedEquipmentContext);
  const { main_categories, filterHeight, onClickItem, onLoad } = props;
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const item_id = router.query.item_id ? router.query.item_id : null;
  const [home, setHome] = useState<any>(onLoad);
  const [previousCategory, setPreviousCategory] = useState<any>(null);
  const [showMainCategories, setShowMainCategories] = useState(true);
  const [mainCategory, setMainCategory] = useState<any>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [subCategoryId, setSubCategoryId] = useState<any>(router.query.sub_id);
  const [showItemList, setShowItemList] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(item_id);

  const { data, isLoading, error, mutate } = useSWR(
    [
      subCategoryId
        ? `/api/items/get_items_by_sub_category/${subCategoryId}`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    let item: any;
    let mainCat: any;
    let category: any;
    let subCat: any;

    if (data && Array.isArray(data) && data.length > 0) {
      item = data.find(
        (_item: any) => _item._item_id === router.query?.item_id
      );

      onClickItem && onClickItem(item);
    }

    if (item) {
      mainCat = main_categories.find(
        (_item: any) =>
          _item.item_main_category_id === item?.item_main_category_id
      );
    }

    if (mainCat) {
      category = mainCat.categories.find(
        (_item: any) => _item.item_category_id === item?.item_category_id
      );
      setCategories(mainCat.categories);
    }

    if (category) {
      // subCat = category.sub_categories.find(
      //   (_item: any) => _item.item_sub_category_id === item?.item_sub_category_id
      // );
      setSubCategories(category.sub_categories);
    }

    if (activeItem) {
      setSubCategoryId(router.query.sub_id);
      setShowMainCategories(false);
      setShowCategories(false);
      setShowSubCategories(false);
      setShowItemList(true);
      setPreviousCategory("subCategory");
    }
  }, [
    data,
    onClickItem,
    activeItem,
    main_categories,
    router.query?.item_id,
    router.query.sub_id,
  ]);

  return (
    <div className={cn("w-[400px]")}>
      <ScrollArea
        className="bg-white rounded-app py-0"
        viewPortClassName=" h-[400px]"
        viewPortStyle={{
          height: `calc(100vh - ${
            filterHeight + "px"
          } - 50px - var(--header-height))`,
        }}
      >
        <span
          className={cn(
            "text-lg h-[120px] flex flex-col items-start gap-2 px-3 sticky top-0",
            "backdrop-blur-sm bg-white/40 z-[1]"
          )}
        >
          <div className="text-lg flex items-center gap-2 mt-2">
            {previousCategory !== null && (
              <ChevronLeft
                className="hover:bg-stone-300 hover:cursor-pointer rounded-full"
                color="gray"
                onClick={() => {
                  if (previousCategory == null) {
                    setShowMainCategories(true);
                    setShowCategories(false);
                    setShowSubCategories(false);
                    setShowItemList(false);
                  } else if (previousCategory == "main") {
                    setShowMainCategories(true);
                    setShowCategories(false);
                    setShowSubCategories(false);
                    setShowItemList(false);
                    setPreviousCategory(null);
                  } else if (previousCategory == "category") {
                    setShowMainCategories(false);
                    setShowCategories(true);
                    setShowSubCategories(false);
                    setShowItemList(false);
                    setPreviousCategory("main");
                  } else if (previousCategory == "subCategory") {
                    setShowMainCategories(false);
                    setShowCategories(false);
                    setShowSubCategories(true);
                    setShowItemList(false);
                    setPreviousCategory("category");
                  }
                  setActiveItem(null);
                  console.log({ previes: previousCategory });
                }}
              />
            )}
            Filter by Categories
          </div>
          <div className="bg-stone-10 flex items-center w-full rounded-app px-2 h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background ring-offset-2 border border-input">
            <Search className="text-stone-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search"
              className="outline-none text-sm w-full px-2 bg-transparent h-full"
              name="search"
            />
          </div>
          <CategoryNavs mainCategory={mainCategory} />
        </span>
        {showMainCategories &&
          main_categories &&
          main_categories.length > 0 && (
            <div className="transition-opacity duration-700">
              {main_categories &&
                main_categories.map((item: any, key: number) => (
                  <div
                    className={`p-2 back transition-transform ease-in-out duration-300`}
                    key={key}
                  >
                    <div
                      className="p-2 hover:bg-stone-300 hover:cursor-pointer rounded-app flex items-center justify-between"
                      onClick={() => {
                        setCategories(item.categories);
                        setShowMainCategories(false);
                        setShowCategories(true);
                        setShowSubCategories(false);
                        setPreviousCategory("main");
                        setShowItemList(false);
                        setMainCategory(item);
                      }}
                    >
                      <span className="text-stone-500 flex text-base">
                        {item.item_main_category_name}
                      </span>
                      <ChevronRight color="gray" />
                    </div>
                  </div>
                ))}
            </div>
          )}

        {showCategories && categories && categories.length > 0 && (
          <div className="transition-opacity duration-700">
            {categories &&
              categories.map((item: any, key: number) => (
                <div
                  className={`p-2 back transition-transform ease-in-out duration-300`}
                  key={key}
                >
                  <div
                    className="p-2 hover:bg-stone-300 hover:cursor-pointer rounded-app flex items-center justify-between"
                    onClick={() => {
                      setSubCategories(item.sub_categories);
                      setShowMainCategories(false);
                      setShowCategories(false);
                      setShowSubCategories(true);
                      setPreviousCategory("category");
                      setShowItemList(false);
                    }}
                  >
                    <span className="text-stone-500 flex text-base">
                      {item.item_category_name}
                    </span>
                    <ChevronRight color="gray" />
                  </div>
                </div>
              ))}
          </div>
        )}

        {showSubCategories && subCategories && subCategories.length > 0 && (
          <div
            className="transition-opacity duration-700"
            style={{
              transition: showSubCategories ? "opacity 0.5s ease-in-out;" : "",
            }}
          >
            {subCategories &&
              subCategories.map((item: any, key: number) => (
                <div
                  className={`p-2 back transition-transform ease-in-out duration-300`}
                  key={key}
                >
                  <div
                    className="p-2 hover:bg-stone-300 hover:cursor-pointer rounded-app flex items-center justify-between"
                    onClick={() => {
                      setShowMainCategories(false);
                      setShowCategories(false);
                      setShowSubCategories(false);
                      setPreviousCategory("subCategory");
                      setSubCategoryId(item.item_sub_category_id);
                      setShowItemList(true);
                      setHome(false);
                    }}
                  >
                    <span className="text-stone-500 flex text-base">
                      {item.item_sub_category_name}
                    </span>
                    <ChevronRight color="gray" />
                  </div>
                </div>
              ))}
          </div>
        )}

        {data && data.length > 0 && showItemList && (
          <div className="transition-opacity duration-700">
            {data &&
              data.map((item: any, key: number) => (
                <div
                  className={`p-1 back transition-transform ease-in-out duration-300`}
                  key={key}
                >
                  <div
                    className={cn(
                      "p-2 hover:bg-stone-300 hover:cursor-pointer rounded-app flex items-center gap-4",
                      (activeItem == item._item_id ||
                        router.query.item_id == item._item_id) &&
                        "bg-stone-200"
                    )}
                    onClick={() => {
                      onClickItem && onClickItem(item);
                      router.push(
                        `/documents/equipment?item_id=${item._item_id}&parent_id=0&sub_id=${item.item_sub_category_id}`
                      );
                      setActiveItem(item._item_id);
                      setPreviousCategory("subCategory");
                    }}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={`${baseUrl}/equipments/thumbnail/${
                        item.item_image ? item.item_image : "comming-soon.jpg"
                      }`}
                      className="h-[50px] w-[50px] object-cover text-xs rounded-md"
                      alt={item.item_name}
                    />
                    <div>
                      <span className="flex font-medium">{item.item_name}</span>
                      <span className="text-stone-500 flex">
                        {item.article_number}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

type categoryProps = {
  main_categories?: any;
  filterHeight?: any;
  onClickItem?: (item: any) => void;
  onLoad?: any;
};

export default memo(Categories);

const CategoryNavs = ({ mainCategory }: { mainCategory?: any }) => {
  const router = useRouter();
  const selectedEquipment: any = useContext(SelectedEquipmentContext);
  let dirs: any = [];
  const query: any = router.query;

  if (router.query?.dirs) {
    dirs = JSON.parse(query?.dirs);
  }

  const onNavigateItem = () => {
    if (selectedEquipment) {
      router.push(
        `/documents/equipment?item_id=${selectedEquipment._item_id}&parent_id=0`
      );
    }
  };

  const onNavigateFolder = (dir: any) => {
    const _query: any = {};
    let dirs = jsonDirs();

    _query.parent_id = dir.id;
    // _query.sub_id = query.sub_id

    if (selectedEquipment) {
      _query.item_id = selectedEquipment._item_id;
    }

    if (Array.isArray(dirs)) {
      const currDirIndex = dirs.findIndex((item: any) => item.id === dir.id);
      if (currDirIndex === 0) {
        dirs.splice(1);
      }

      if (currDirIndex > 0) {
        dirs.splice(currDirIndex);
      }

      _query.dirs = JSON.stringify(dirs);
    }

    let searchParams = new URLSearchParams(_query);

    router.push(`/documents/equipment?${searchParams.toString()}`);
  };

  const jsonDirs = () => {
    const query: any = { ...router.query };
    try {
      if (query.dirs) {
        return JSON.parse(query.dirs);
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div className="flex gap-1 items-center">
        <span
          className="flex gap-1 items-center hover:underline cursor-pointer text-sm"
          tabIndex={0}
          onClick={onNavigateItem}
        >
          {mainCategory && mainCategory.item_main_category_name}
        </span>
        {Array.isArray(dirs) && dirs.length !== 0 && (
          <ChevronRight className="w-[15px]" />
        )}
      </div>
      {Array.isArray(dirs) &&
        dirs.map((item: any, key: number) => (
          <div className="flex gap-1" key={key}>
            <span
              className="hover:underline cursor-pointer"
              tabIndex={0}
              onClick={() => onNavigateFolder(item)}
            >
              {item.name}
            </span>
            {key !== dirs.length - 1 && <ChevronRight className="w-[15px]" />}
          </div>
        ))}
    </div>
  );
};
