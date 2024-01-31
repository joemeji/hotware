import EditSignatoryModal from "@/components/admin-pages/company-letters/modals/EditSignatoryModal"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { memo, useState } from "react"
import { mutate } from "swr"
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avatarFallback } from "@/utils/avatar"
import { ActionMenu, TD, TH } from "../create"

interface ISignatoryData {
  name: string,
  userId: number,
  id: number
}

const SignatoryLists = () => {

  const [editSignatoryModal, setEditSignatoryModal] = useState(false)
  const [signatoryId, setSignatoryId] = useState('')

  const handleDelete = async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/signatory/delete', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/signatory/lists`);
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

  const handleEdit = async (id: any) => {
    setEditSignatoryModal(true)
    setSignatoryId(id)
  }

  const { data, isLoading } = useSWR(`/api/signatory/lists`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const formatData = (data: any) => {
    if (!data) return null

    return data.map((signatory: any) => ({
      name: `${signatory?.user_firstname} ${signatory?.user_lastname}`,
      photo: signatory?.user_photo,
      firstname: signatory?.user_firstname,
      lastname: signatory?.user_lastname,
      avatarColor: signatory?.avatar_color,
      id: signatory?.signatory_id
    }))
  }

  if (isLoading) return <Skeleton />

  const formattedData = formatData(data)


  return (
    <>
      <EditSignatoryModal
        signatoryId={signatoryId}
        open={editSignatoryModal}
        onOpenChange={(open: any) => setEditSignatoryModal(open)}
      />
      <table className="w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden">
        <thead>
          <tr>
            <TH className="text-center">ID</TH>
            <TH>Photo</TH>
            <TH>Name</TH>
            <TH className="text-center">Actions</TH>
          </tr>
        </thead>
        <tbody className="">
          {formattedData && formattedData.length > 0 && formattedData.map((signatory: any, i: any) => {
            return <tr key={i}>
              <td className='p-1 text-center'>{signatory.id}</td>
              <td className='p-1 text-left'>
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`${baseUrl}/users/thumbnail/${signatory?.photo}`}
                    alt={signatory?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-medium text-white" style={{ background: signatory?.avatarColor }}>
                    {avatarFallback(signatory?.firstname, signatory?.lastname)}
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className='p-1'>{signatory.name}</td>
              <td className='flex gap-1 justify-center py-3'>
                <ActionMenu
                  onEdit={() => handleEdit(signatory.id)}
                  onDelete={() => handleDelete({ id: signatory.id })}
                />
              </td>
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

export default memo(SignatoryLists)



