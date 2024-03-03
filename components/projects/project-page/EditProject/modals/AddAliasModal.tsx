import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddAliasModal(props: AddAliasModalProps) {
  const { open, onOpenChange, onAdded, employeeId } = props;
  const [aliasName, setAliasName] = useState<any>(null);

  const onSubmit = (e: any) => {
    onAdded && onAdded(employeeId, aliasName);
    onOpenChange && onOpenChange(false);
    setAliasName(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent className="max-w-[400px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Set Alias</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-2">
              <label>Alias Name</label>
              <div>
                <Input
                  placeholder="Alias Name"
                  className="bg-stone-100 border-0"
                  required
                  onChange={(e) => setAliasName(e.target.value)}
                  value={aliasName || ""}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button onClick={onSubmit} type="button" disabled={!aliasName}>
              Add Alias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddAliasModal);

type AddAliasModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAdded?: (employeeId?: any, aliasName?: any) => void;
  employeeId?: any;
};
