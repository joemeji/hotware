import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { updateListCategorySchema } from "../../schema"
import { ActionMenu, TD, TH, tableCategoryHeadings } from "../.."
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/router"
import Pagination from "@/components/pagination";
import { fetcher } from "@/utils/api.config";
import { PER_PAGE } from "@/utils/algoliaConfig";

export const CATEGORY_LIST_LIMIT = 10

interface ISettingsItemsCategoryLists {
  listUrl: string
}

export const SettingsItemsCategoryLists = (
  props: ISettingsItemsCategoryLists
) => {
  const { listUrl } = props;

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { data: categories, isLoading } = useSWR(
    listUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  // pager
  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const [categoriesPager, setCategoriesPager] = useState<any>(null);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (categories && categories.pager) {
      setCategoriesPager(categories.pager);
    }
  }, [categories]);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(updateListCategorySchema),
  });

  const submitItemCategory = async (data: any) => {
    if (tableMode === "edit") {
      updateItemCategory(data);
    }

    if (tableMode === "delete") {
      deleteItemCategory(data);
    }
  };

  const updateItemCategory = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/item/category/update", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Updated",
          variant: "success",
          duration: 4000,
        });

        setTableMode("view");
        reloadTable();
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  const deleteItemCategory = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/item/category/delete", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Deleted.",
          variant: "success",
          duration: 4000,
        });

        reloadTable();
        setTableMode("view");
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  const updateConsumable = async (
    itemCategoryId: string,
    is_consumable: boolean
  ) => {
    try {
      const payload = {
        category_id: itemCategoryId,
        category_is_consumable: is_consumable,
      };

      const res = await fetch("/api/item/category/update-consumable", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json && json.success) {
        toast({
          title: "Item category successfully set to consumable",
          variant: "success",
          duration: 4000,
        });

        reloadTable();
        setTableMode("view");
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  const [tableMode, setTableMode] = useState("view");

  const onEdit = (data: {
    id: string;
    categoryName: string;
    categoryDesc: string;
  }) => {
    setSelectedId(data.id);
    setTableMode("edit");
    setValue("category_name", data.categoryName);
    setValue("category_desc", data.categoryDesc);
    setValue("category_id", data.id);
  };

  const onDelete = (data: any) => {
    setSelectedId(data.id);
    setValue("category_name", data.categoryName);
    setValue("category_desc", data.categoryDesc);
    setValue("category_id", data.id);
    setTableMode("delete");
  };

  const reloadTable = () => {
    mutate(listUrl);
  };
  console.log('form error', errors)

  return (
    <>
      <form onSubmit={handleSubmit(submitItemCategory)}>
        <table className='w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden my-5'>
          <thead>
            <tr>
              {tableCategoryHeadings &&
                tableCategoryHeadings.length > 0 &&
                tableCategoryHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {categories?.categories &&
              categories?.categories.length > 0 &&
              categories?.categories.map((category: any, i: number) => {
                return (
                  <tr key={i}>
                    <TD>
                      {(page - 1) * PER_PAGE + i + 1}
                      {(tableMode == "edit" || tableMode == "delete") && (
                        <Input type='hidden' {...register("category_id")} />
                      )}
                    </TD>
                    <TD>
                      {category?.item_main_category_name}
                      {(tableMode == "edit" || tableMode == "delete") && (
                        <Input type='hidden' {...register("category_id")} />
                      )}
                    </TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter main category name'
                          error={
                            errors && (errors.category_name ? true : false)
                          }
                          {...register("category_name")}
                        />
                      ) : (
                        category?.item_category_name
                      )}
                    </TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter description'
                          defaultValue={""}
                          error={
                            errors && (errors.category_desc ? true : false)
                          }
                          {...register("category_desc")}
                        />
                      ) : (
                        category?.item_category_description
                      )}
                    </TD>
                    <TD className='text-center'>
                      <Checkbox
                        className='bg-stone-100 border-transparent'
                        // defaultChecked={category.is_consumable ? true : false}
                        defaultChecked={
                          category.is_consumable == "1" ? true : false
                        }
                        onCheckedChange={(value) => {
                          updateConsumable(
                            category.item_category_id,
                            value as boolean
                          );
                        }}
                        {...register("category_is_consumable")}
                      />
                    </TD>

                    <TD className='flex gap-2'>
                      <div>
                        <ActionMenu
                          onEdit={onEdit}
                          onDelete={onDelete}
                          data={{
                            id: category.item_category_id,
                            categoryName: category.item_category_name,
                            categoryDesc: category.item_category_description,
                          }}
                        />
                      </div>
                      <div>
                        {tableMode === "edit" &&
                          selectedId == category.item_category_id && (
                            <Button value='success' className='bg-green-500'>
                              Save
                            </Button>
                          )}
                        {tableMode === "delete" &&
                          selectedId == category.item_category_id && (
                            <Button value='danger' className='bg-red-500'>
                              Confirm
                            </Button>
                          )}
                      </div>
                    </TD>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isLoading && <Loader2 className='animate-spin mx-auto' />}
      </form>
      {categories && (
        <div className='mt-auto border-t border-t-stone-100 flex justify-end'>
          <Pagination pager={categoriesPager} onPaginate={onPaginate} />
        </div>
      )}
    </>
  );
};