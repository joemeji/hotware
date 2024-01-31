import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { HTMLInputTypeAttribute, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { updateListSubcategorySchema } from "../../schema"
import { ActionMenu, TD, TH, tableSubcategoryHeadings  } from "../.."
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/router"
import Pagination from "@/components/pagination";
import { fetcher } from "@/utils/api.config";


interface ISettingsItemsSubcategoryLists {
  listUrl:  string
}
export const SettingsItemsSubcategoryLists = (props: ISettingsItemsSubcategoryLists) => {

  const {listUrl} = props
  const router = useRouter()
  const [page, setPage] = useState(1)

  const {data: subcategories, isLoading} = useSWR(listUrl, fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  // pager
  const onPaginate = (page: any) => {
    setPage(page)

    router.push({
      query: {
        page: page
      }
    });
  };

  const [categoriesPager, setCategoriesPager] = useState<any>(null);
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    if (subcategories && subcategories.pager) {
      setCategoriesPager(subcategories.pager);
    }
  }, [subcategories]);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(updateListSubcategorySchema)
  });

  const submitItemCategory = async (data: any) => {

    if (tableMode === 'edit') {
      updateItemSubcategory(data)
    } 

    if (tableMode === 'delete') {
      deleteItemCategory(data)
    }
  }

  const updateItemSubcategory =  async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/subcategory/update', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {

        toast({
          title: "Successfully Updated",
          variant: 'success',
          duration: 4000
        });

        setTableMode('view')
        reloadTable()

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }


    } catch { }
  }

  const deleteItemCategory = async (data: any) => {

    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/subcategory/delete', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Deleted.",
          variant: 'success',
          duration: 4000
        });

        reloadTable()
        setTableMode('view')

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }


    } catch { }
  }

  const [tableMode, setTableMode] = useState('view')

  const onEdit = (data : {
    id: string
    categoryName: string
    categoryDesc: string
  }) => {
    setSelectedId(data.id)
    setTableMode('edit')
    setValue('subcategory_name', data.categoryName)
    setValue('subcategory_desc', data.categoryDesc)
    setValue('subcategory_id', data.id)
  }

  const onDelete = (data: any) => {
    setSelectedId(data.id)
    setValue('subcategory_name', data.categoryName)
    setValue('subcategory_desc', data.categoryDesc)
    setValue('subcategory_id', data.id)
    setTableMode('delete')
  }


  const reloadTable = () => {
    mutate(listUrl)
  };

  
  return (
    <>
      <form onSubmit={handleSubmit(submitItemCategory)}>
        <table className='w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden my-5'>
          <thead>
            <tr>
              {tableSubcategoryHeadings &&
                tableSubcategoryHeadings.length > 0 &&
                tableSubcategoryHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {subcategories?.subcategories &&
              subcategories?.subcategories.length > 0 &&
              subcategories?.subcategories.map((category: any, i: number) => {
                return (
                  <tr key={i}>
                    <TD>
                      {category?.item_sub_category_id}
                      {(tableMode == "edit" || tableMode == "delete") && (
                        <Input type='hidden' {...register("subcategory_id")} />
                      )}
                    </TD>
                    <TD>{category?.item_main_category_name}</TD>
                    <TD>{category?.item_category_name}</TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_sub_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter main category name'
                          error={
                            errors && (errors.subcategory_name ? true : false)
                          }
                          {...register("subcategory_name")}
                        />
                      ) : (
                        category?.item_sub_category_name
                      )}
                    </TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_sub_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter description'
                          defaultValue={""}
                          error={
                            errors && (errors.subcategory_desc ? true : false)
                          }
                          {...register("subcategory_desc")}
                        />
                      ) : (
                        category?.item_sub_category_description
                      )}
                    </TD>

                    <TD className='flex gap-2'>
                      <div>
                        <ActionMenu
                          onEdit={onEdit}
                          onDelete={onDelete}
                          data={{
                            id: category.item_sub_category_id,
                            categoryName: category.item_sub_category_name,
                            categoryDesc:
                              category.item_sub_category_description,
                          }}
                        />
                      </div>
                      <div>
                        {tableMode === "edit" &&
                          selectedId == category.item_sub_category_id && (
                            <Button value='success' className='bg-green-500'>
                              Save
                            </Button>
                          )}
                        {tableMode === "delete" &&
                          selectedId == category.item_sub_category_id && (
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
      {subcategories?.pager && (
        <div className='mt-auto border-t border-t-stone-100 flex justify-end'>
          <Pagination pager={categoriesPager} onPaginate={onPaginate} />
        </div>
      )}
    </>
  );
}