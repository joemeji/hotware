import { Button } from "@/components/ui/button";
import { Pencil, Trash, X } from "lucide-react";
import { Search } from "./Search";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { fetcher } from "@/utils/api.config";
import CategoryDropdown from "../category-dropdown";
import EditCmsCategoryModal from "../modals/EditCmsCategoryModal";
import { DeleteCmsCategoryModal } from "../modals/DeleteCmsCategoryModal";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import SearchInput from "@/components/app/search-input";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const Buttons = ({
  onSearch,
  success,
}: {
  onSearch?: (search: any) => void;
  success?: any;
}) => {
  const router = useRouter();
  const [eventCategory, setEventCategory] = useState(null);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const [cmsCategory, setCmsCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);

  const page = router.query?.page || 1;

  const { data, isLoading, error, mutate } = useSWR(
    "/api/cms/get_categories",
    fetcher,
    swrOptions
  );

  useEffect(() => {
    if (router.query?.category) {
      setActiveCategory(router.query?.category);
    }

    if (success) {
      mutate(data);
    }
  }, [router, setActiveCategory, data, success, mutate]);

  function filterCmsLists(category: any) {
    setActiveCategory(category);
    let paramsObj: any = {
      page: String(page),
      category: category,
    };
    let searchParams = new URLSearchParams(paramsObj);

    router.push(`/address-manager?${searchParams.toString()}`);
  }

  return (
    <>
      {openEditCategoryModal && (
        <EditCmsCategoryModal
          open={openEditCategoryModal}
          onOpenChange={(open: any) => setOpenEditCategoryModal(open)}
          cms={cmsCategory}
        />
      )}
      {openDeleteCategoryModal && (
        <DeleteCmsCategoryModal
          open={openDeleteCategoryModal}
          onOpenChange={(open: any) => setOpenDeleteCategoryModal(open)}
          cms={cmsCategory}
        />
      )}
      <div className="px-3 py-2 ps-[8px] flex items-center justify-between">
        <div className="flex items-center gap-1 me-2">
          <Button
            variant="secondary"
            className={cn(
              "rounded-xl py-1.5 flex gap-2 hover:bg-stone-200",
              activeCategory === "null" &&
                "bg-primary text-white pointer-events-none"
            )}
            onClick={() => filterCmsLists(null)}
          >
            <span>All</span>
            <span className="text-sm font-normal">
              {data && data.total_all_cms}
            </span>
          </Button>
          {Array.isArray(data?.categories) &&
            data.categories.map((category: any, key: number) => (
              <div className="flex relative" key={key}>
                <Button
                  variant="secondary"
                  className={cn(
                    "rounded-xl py-1.5 flex gap-2 hover:bg-stone-200",
                    activeCategory === category.cms_category_id &&
                      "bg-primary text-white pointer-events-none"
                  )}
                  onClick={() => filterCmsLists(category.cms_category_id)}
                >
                  <span>{category.cms_category_name}</span>
                  <span className="text-sm font-normal flex items-center">
                    {category.total_cms}
                  </span>
                </Button>
                {eventCategory && eventCategory == "edit" ? (
                  <div className="h-[24px] flex items-center rounded-xl shadow-sm border border-stone-100 bg-white absolute top-[-6px] right-[-6px]">
                    <Pencil
                      height={14}
                      className="text-orange-400 hover:cursor-pointer rounded-xl"
                      onClick={() => {
                        setOpenEditCategoryModal(true);
                        setCmsCategory(category);
                      }}
                    />
                  </div>
                ) : eventCategory == "delete" ? (
                  <div className="h-[24px] flex items-center rounded-xl shadow-sm border border-stone-100 bg-white absolute top-[-6px] right-[-6px]">
                    <Trash
                      height={14}
                      className="text-rose-400 hover:cursor-pointer rounded-xl"
                      onClick={() => {
                        setOpenDeleteCategoryModal(true);
                        setCmsCategory(category);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          {eventCategory && eventCategory != null ? (
            <button className="p-1 py-0.5 ms-2 text-stone-400 border-0 bg-transparent h-auto rounded-full hover:bg-stone-100">
              <X
                className="text-rose-400 w-[20px]"
                onClick={() => setEventCategory(null)}
              />
            </button>
          ) : null}
          <CategoryDropdown
            onClickItem={(action: any) => setEventCategory(action)}
          />
        </div>
        <SearchInput
          onChange={(e) => onSearch && onSearch(e.target.value)}
          // value={search}
          delay={500}
        />
      </div>
    </>
  );
};
