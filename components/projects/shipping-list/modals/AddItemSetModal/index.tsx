import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccessTokenContext } from "@/context/access-token-context";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ItemSetSelect from "@/components/ItemSetSelect";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { cn } from "@/lib/utils";
import { useSWRConfig } from "swr";

const AddItemSetModal = (props: AddItemSetModal) => {
  const access_token = useContext(AccessTokenContext);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const { open, onOpenChange } = props;
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const shipping_id = shippingDetails ? shippingDetails._shipping_id: null;
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const onSave = async () => {
    try {
      setLoading(true);
      const payload = [...selectedItems].map((item: any) => {
        return {
          shipping_item_is_set: 1, 
          item_set_id: item.item_set_id,
          _item_id: null,
        }
      });
      const options = {
        method: 'POST', 
        body: JSON.stringify({ items: payload }),
        headers: { ...authHeaders(access_token) }
      };
      const res = await fetch(baseUrl + '/api/projects/shipping/items/create/' + shipping_id, options);
      const json = await res.json();

      if (json.success) {
        setLoading(false);
        mutate(`/api/shipping/${shipping_id}/items`);
        onOpenChange && onOpenChange(false);
      }
    }
    catch(err: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) setSelectedItems([]);
  }, [open]);
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange && onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 "
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            Select Item Sets
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>

        <ItemSetSelect 
          selectedItems={selectedItems}
          onSelectItems={(items) => setSelectedItems(items)}
        />

        <DialogFooter className="p-3">
        <Button variant={'ghost'} type="button"
          onClick={() => onOpenChange && onOpenChange(false)}
        >
          Close
        </Button>
        <Button type="submit" 
          onClick={onSave}
          className={cn(loading && 'loading')}
        >
          Save
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AddItemSetModal);

type AddItemSetModal = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}