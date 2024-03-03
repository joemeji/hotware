import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Forward, FileText } from "lucide-react";
import AddNewContactModal from "../modals/AddNewContactModal";

export const AddNewContact = ({
  onSuccess,
}: {
  onSuccess?: (value: boolean) => void;
}) => {
  const [openContactModal, setOpenContactModal] = useState(false);

  return (
    <>
      {openContactModal && (
        <AddNewContactModal
          open={openContactModal}
          onOpenChange={(open: any) => setOpenContactModal(open)}
          onSuccess={(value: any) => onSuccess && onSuccess(value)}
        />
      )}
      <div
        className={cn(
          "p-3 flex justify-between items-center",
          "border-b border-b-stone-100"
        )}
      >
        <span className="text-lg font-medium">Companies</span>
        <div className="flex items-center gap-2">
          <Button
            className="gap-2 ps-3 pe-4 rounded-full"
            variant="secondary"
            onClick={() => setOpenContactModal(true)}
          >
            <Plus className="w-[20px] h-[20px] text-red-600" />
            Add New Contact
          </Button>
          <Button className="gap-2 ps-4 pe-5 rounded-full">
            <FileText className="w-[18px] h-[18px] " />
            Export Contact
          </Button>
        </div>
      </div>
    </>
  );
};
