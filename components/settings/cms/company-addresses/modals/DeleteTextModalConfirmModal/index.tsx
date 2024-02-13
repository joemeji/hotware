import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { mutate } from "swr";

export const DeleteTextModalConfirmModal = (props: IDepartmentModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  const deleteCurrency = async () => {
    try {
      const res = await fetch("/api/cms/company-addresses/delete", {
        method: "POST",
        body: JSON.stringify({
          id: data?.cms_owner_id,
        }),
      });

      const json = await res.json();
      if (json && json.success) {
        mutate("/api/cms/company-addresses/cms-owner");
        mutate(listUrl);
        toast({
          title: "Successfully Deleted",
          variant: "success",
          duration: 4000,
        });

        if (onOpenChange) onOpenChange(false);
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} hideClose>
      <div className='pb-5 px-5'>
        <div className='flex flex-col gap-3 justify-center items-center'>
          <AlertCircle size='100' strokeWidth={1} className='text-orange-300' />
          <h2 className='text-2xl font-bold text-gray-600'>Are you sure ?</h2>
          <p className='text-lg w-1/2 text-center'>
            Are you sure you want to delete {data?.cms_name} ? You won&apos;t be
            able to revert this.
          </p>
          <div className='flex gap-2'>
            <Button
              variant='default'
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant='red' onClick={deleteCurrency}>
              Yes
            </Button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

type IDepartmentModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
