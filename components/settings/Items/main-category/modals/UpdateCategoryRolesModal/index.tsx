import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, PlusIcon, X } from "lucide-react";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useSWR, { mutate } from "swr";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignatoryNameSelect } from "@/components/admin-pages/company-letters/form-elements/SignatoryNameSelect";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { UserRoleSelect } from "../../form/elements/UserRoleSelect";
import { UpdateCategoryRolesList } from "../../lists/UpdateCategoryRolesList";

const yupObject: any = {
  category_role: yup.string().required('This field is required.'),
};

function UpdateCategoryRolesModal(props: IUpdateCategoryRolesModal) {

  const { open, onOpenChange, itemMainCategoryId } = props;

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(yupSchema)
  });


  const createMainCategoryRoles = async (data: any) => {
    try {
      const payload = {
        ...data,
        category_id: itemMainCategoryId
      };

      const res = await fetch('/api/item/main-category/roles/create', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/item/main-category/roles/lists?categoryId=${itemMainCategoryId}`);
        toast({
          title: "Successfully added.",
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



  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Update Category Role Modal'
    >
      <form
        action=''
        method='post'
        onSubmit={handleSubmit(createMainCategoryRoles)}
        className="p-3"
      >
        <div className='p-3'>
          <div className='grid xl:grid-cols-12 gap-3'>
            <div className='col-span-10 w-full'>
              <Controller
                name='category_role'
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <UserRoleSelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
              {errors.category_role && (
                <span className='text-red-500 text-sm'>
                  <>{errors.category_role?.message}</>
                </span>
              )}
            </div>
            <div className='col-span-2 w-full'>
              <Button type='submit' variant='red'>
                <PlusCircle className='mr-1' />
                Add
              </Button>
            </div>
          </div>
        </div>
        <UpdateCategoryRolesList categoryId={itemMainCategoryId} />
      </form>
    </GenericModal>
  );
}

export default memo(UpdateCategoryRolesModal)

type IUpdateCategoryRolesModal = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  itemMainCategoryId: string
}