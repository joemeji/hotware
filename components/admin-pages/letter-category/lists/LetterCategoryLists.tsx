import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { memo, useState } from "react"
import { mutate } from "swr"
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avatarFallback } from "@/utils/avatar"
import { ActionMenu, TD, TH } from ".."

interface ILetterCategoryData {
  name: string,
  userId: number,
  id: number
}

const LetterCategoryLists = () => {

  const handleDelete = async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/letter-category/delete', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/letter-category/lists`);
        toast({
          title: "Successfully deleted",
          variant: 'success',
          duration: 4000
        });

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }

    } catch { }
  }


  const { data, isLoading } = useSWR(`/api/letter-category/lists`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (isLoading) return <Skeleton />

  return (
    <>
      <table className="w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden">
        <thead>
          <tr>
            <TH className="text-center">ID</TH>
            <TH>Name</TH>
            <TH className="text-center">Actions</TH>
          </tr>
        </thead>
        <tbody className="">
          {data && data.length > 0 && data.map((category: any, i: any) => {
            return <tr key={i}>
              <TD className="text-center"> {category?.letter_category_id} </TD>
              <TD> {category?.letter_category_name} </TD>
              <TD className="text-center">
                <ActionMenu
                  onDelete={() => handleDelete({ id: category?.letter_category_id })}
                />
              </TD>
            </tr>
          })}

        </tbody>
      </table>
      {!data || data.length === 0 &&
        <div className='py-5 text-center'>No records found</div>
      }
    </>
  )

}

export default memo(LetterCategoryLists)



