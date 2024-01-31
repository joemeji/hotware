import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { fetcher } from "@/utils/api.config";
import useSWR, { useSWRConfig } from 'swr';
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { Checkbox } from "@/components/ui/checkbox";
import { mutateIndex, returnItemApi } from "@/services/shipping/item";
import { mutateIndex as mutateIndexSet } from "@/services/shipping/set";

function ReturnEquipmentModal(props: ReturnEquipmentModalProps) {
  const { open, onOpenChange, item } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const warehouse_id = shippingDetails ? shippingDetails.warehouse_id : null;
  const currency = shippingDetails ? shippingDetails.currency : null;
  const shipping_item_id = item ? item.shipping_item_id : null;
  const _shipping_id = shippingDetails ? shippingDetails._shipping_id : null;
  const { mutate: mutateConfig } = useSWRConfig();

  let shipping_item_quantity = item ? item.shipping_item_quantity : null;
  shipping_item_quantity = isNaN(shipping_item_quantity) ? 0 : Number(shipping_item_quantity);

  if (item?.item_set_list_quantity) {
    shipping_item_quantity = isNaN(item?.item_set_list_quantity) ? 0 : Number(item?.item_set_list_quantity);
  }

  let maxQuantity = shipping_item_quantity;
  let totalReturn = 0;

  const uri = () => {
    if (!open) return null;
    if (!shipping_item_id) return null;
    return `/api/shipping/shipping_item/${shipping_item_id}/return_item`;
  }

  const setItemUri = () => {
    if (!open) return null;
    if (!item?.item_set_id) return null;
    return `/api/shipping/set/${item?.shipping_item_details_id}/returned_item_set`;
  }

  let _uri = item?.item_set_id ? setItemUri() : uri();

  const { data, error, isLoading, mutate } = useSWR(_uri, fetcher);

  if (data && data.total_shipping_return_item_quantity) {
    maxQuantity = shipping_item_quantity - Number(data.total_shipping_return_item_quantity);
    totalReturn = Number(data.total_shipping_return_item_quantity);
  }

  const yupObject: any = {
    return_quantity: yup
        .number()
        .typeError('Quantity must be a number')
        .min(1, 'Quantity must be greater to 1')
        .max(maxQuantity, 'Quantity must not greater to ' + maxQuantity)
        .required('Quantity is required'),

      is_consumable: yup.boolean(),
  };
  
  const yupSchema = yup.object(yupObject);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema)
  });

  const onSubmitEditForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        ...data, 
        shipping_item_id
      };

      if (item?.item_set_id) {
        payload.shipping_item_details_id = item?.shipping_item_details_id;
      }
      const json = await returnItemApi(_shipping_id, payload);
      if (json && json.success) {
        mutateConfig( mutateIndex(shippingDetails?._shipping_id) );
        mutateConfig( mutateIndexSet(shippingDetails?._shipping_id, item?.shipping_item_id) );
        onOpenChange && onOpenChange(false);
      }
    }
    catch(err: any) {
      console.log(err);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) clearErrors();
  }, [open, clearErrors]);

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={open => !isSubmitting && onOpenChange && onOpenChange(open)}
      >
        <DialogContent forceMount className="max-w-[400px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>
              Return Equipment
            </DialogTitle>
            <DialogPrimitive.Close disabled={isSubmitting} className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEditForm)}>
            
            <div className="px-3 flex flex-col">

              <p className="bg-red-50 w-fit mx-auto px-3 py-2 rounded-full">
                Returned: <span className="font-medium text-base">{totalReturn} <span className="opacity-60">/</span> {shipping_item_quantity}</span>
              </p>

              <div className="flex flex-col gap-2 mb-5">
                <label>Quantity</label>
                <div>
                  <Input type="number" placeholder="Quantity" className="bg-stone-100 border-0" 
                    error={errors && (errors.return_quantity ? true : false)}
                    {...register('return_quantity')}
                  />
                  {errors.return_quantity && (
                    <span className="text-red-500 text-sm">
                      <>{errors.return_quantity?.message}</>
                    </span>
                  )}
                </div>
              </div>
              {!item?.item_set_id && (
                <label className="flex gap-2 items-center w-fit cursor-pointer">
                  <Controller 
                    name="is_consumable"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Checkbox className="w-5 h-5" 
                          value={field.value} 
                          onCheckedChange={checked => field.onChange(checked)}
                        />
                        <span className="font-medium">Consumed</span>
                      </>
                    )}
                  />
                </label>
              )}
            </div>

            <DialogFooter className="p-3">
              <Button variant={'ghost'} type="button" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" 
                disabled={isSubmitting}
                className={cn(isSubmitting && 'loading')}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(ReturnEquipmentModal);

type ReturnEquipmentModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  item?: any
}