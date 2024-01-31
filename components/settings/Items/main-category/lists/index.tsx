import useSWR, { mutate } from "swr"
import { ActionMenu, TD, TH, tableHeadings } from ".."
import { fetcher } from "@/utils/api.config"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { updateMainCategorySchema } from "../form/schema"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { List, Loader2 } from "lucide-react"
import UpdateCategoryRolesModal from "../modals/UpdateCategoryRolesModal"

interface ISettingsItemsMainCategoryLists {
  listUrl: string
}
export const SettingsItemsMainCategoryLists = (props: ISettingsItemsMainCategoryLists) => {

  const {listUrl} = props

  const {data: mainCategories, isLoading} = useSWR(listUrl, fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  const [selectedId, setSelectedId] = useState('')

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(updateMainCategorySchema)
  });

  const submitItemMainCategory = async (data: any) => {

    if (tableMode === 'edit') {
      updateItemMainCategiry(data)
    } 

    if (tableMode === 'delete') {
      deleteItemMainCategory(data)
    }
  }

  const updateItemMainCategiry =  async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/main-category/update', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {

        reloadTable()

        toast({
          title: "Successfully Updated",
          variant: 'success',
          duration: 4000
        });
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

  const deleteItemMainCategory = async (data: any) => {

    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/main-category/delete', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {

        reloadTable()

        toast({
          title: "Successfully deleted",
          variant: 'success',
          duration: 4000
        });
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

  const reloadTable = () => {
    mutate(listUrl)
  }

  const onEdit = (data : {
    id: string
    categoryName: string
    categoryDesc: string
  }) => {
    setSelectedId(data.id)
    setTableMode('edit')
    setValue('category_name', data.categoryName)
    setValue('category_desc', data.categoryDesc)
    setValue('category_id', data.id)
  }

  const onDelete = (data: any) => {
    setSelectedId(data.id)
    setValue('category_id', data.id)
    setValue('category_name', data.categoryName)
    setValue('category_desc', data.categoryDesc)
    setTableMode('delete')
  }
  
  const [updateCategoryRolesModal, setUpdateCategoryRolesModal] = useState(false)
  
  return (
    <>
      <UpdateCategoryRolesModal
        itemMainCategoryId={selectedId}
        open={updateCategoryRolesModal}
        onOpenChange={(open: any) => setUpdateCategoryRolesModal(open)}
      />
      <form onSubmit={handleSubmit(submitItemMainCategory)}>
        <table className='w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden my-5'>
          <thead>
            <tr>
              {tableHeadings &&
                tableHeadings.length > 0 &&
                tableHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              mainCategories &&
              mainCategories.length > 0 &&
              mainCategories.map((category: any, i: number) => {
                return (
                  <tr key={i}>
                    <TD>
                      {category?.item_main_category_id}
                      {(tableMode == "edit" || tableMode == "delete") && (
                        <Input type='hidden' {...register("category_id")} />
                      )}
                    </TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_main_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter main category name'
                          error={
                            errors && (errors.category_name ? true : false)
                          }
                          {...register("category_name")}
                        />
                      ) : (
                        category?.item_main_category_name
                      )}
                    </TD>
                    <TD>
                      {tableMode === "edit" &&
                      selectedId == category.item_main_category_id ? (
                        <Input
                          className='bg-stone-100 border-transparent'
                          placeholder='Enter description'
                          error={
                            errors && (errors.category_desc ? true : false)
                          }
                          {...register("category_desc")}
                        />
                      ) : (
                        category?.item_main_category_description
                      )}
                    </TD>
                    <TD>
                      <Button
                        type='button'
                        variant='secondary'
                        className='font-sm'
                        onClick={() => {
                          setUpdateCategoryRolesModal(true);
                          setSelectedId(category.item_main_category_id);
                        }}
                      >
                        <List />
                        <span className='ml-1'>Update Roles</span>
                      </Button>
                    </TD>
                    <TD className='flex gap-2'>
                      <div>
                        <ActionMenu
                          onEdit={onEdit}
                          onDelete={onDelete}
                          data={{
                            id: category.item_main_category_id,
                            categoryName: category.item_main_category_name,
                            categoryDesc:
                              category.item_main_category_description,
                          }}
                        />
                      </div>
                      <div>
                        {tableMode === "edit" &&
                          selectedId == category.item_main_category_id && (
                            <Button value='success' className='bg-green-500'>
                              Save
                            </Button>
                          )}
                        {tableMode === "delete" &&
                          selectedId == category.item_main_category_id && (
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

        {mainCategories?.length === 0 &&  !isLoading  &&
          <div className="text-center">
             <h2>No records found</h2>
          </div> 
        }
      </form>
    </>
  );
}

