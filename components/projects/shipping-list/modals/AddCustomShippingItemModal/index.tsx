import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { AccessTokenContext } from "@/context/access-token-context";
import { useSWRConfig } from "swr";

function AddCustomShippingItemModal(props: AddCustomShippingItemModalProps) {
  const {
    open, 
    onOpenChange,
    _shipping_id,
    onAdded,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const currency = shippingDetails ? shippingDetails.currency : null;
  const access_token: any = useContext(AccessTokenContext);
  const { mutate } = useSWRConfig();

  const yupSchema = yup.object({
    shipping_item_name: yup.string().required('Item Name is required'),
    shipping_item_quantity: yup
        .number()
        .min(1, 'Quantity must greater to 1')
        .typeError('Quantity must be a number'),
    shipping_item_weight: yup
        .number()
        .min(0)
        .typeError('Weight must be a number'),
    shipping_item_hs_code: yup.string(),
    shipping_item_unit_value: yup.string(),
    shipping_item_country_of_origin: yup.mixed(),
  });

  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    clearErrors,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      shipping_item_name: '',
      shipping_item_quantity: 1,
      shipping_item_weight: 0,
      shipping_item_hs_code: '',
      shipping_item_unit_value: '',
      shipping_item_country_of_origin: '',
    }
  });

  const onSubmitEditForm = async (data: any) => {
    if (Object.keys(errors).length > 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        _shipping_id,
        _item_id: null,
      };
      const options = {
        method: 'POST',
        headers: { ...authHeaders(access_token) },
        body: JSON.stringify({ items: [payload] }),
      };
      const res = await fetch(baseUrl + `/api/projects/shipping/items/create/${_shipping_id}`, options);
      const json = await res.json();
      setIsSubmitting(false);
      onOpenChange && onOpenChange(false);
      if (json.success && Array.isArray(json.items)) {
        onAdded && onAdded(json.items[0]);
        mutate(`/api/shipping/${_shipping_id}/items`);
        setValue('shipping_item_name', '');
        setValue('shipping_item_quantity', 1);
        setValue('shipping_item_weight', 0);
        setValue('shipping_item_hs_code', '');
        setValue('shipping_item_unit_value', '');
        setValue('shipping_item_country_of_origin', '');
      }
    }
    catch(err: any) {
      setIsSubmitting(false);
    }
  };

  const onReset = () => {
    clearErrors();
    setValue('shipping_item_name', '');
    setValue('shipping_item_quantity', 1);
    setValue('shipping_item_weight', 0);
    setValue('shipping_item_hs_code', '');
    setValue('shipping_item_unit_value', '');
    setValue('shipping_item_country_of_origin', '');
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
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>
              Create Custom Item
            </DialogTitle>
            <DialogPrimitive.Close disabled={isSubmitting} className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEditForm)}>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-2">
                <label>Item Name</label>
                <div>
                  <Textarea placeholder="Item Name" className="bg-stone-100 border-0" 
                    error={errors && (errors.shipping_item_name ? true : false)}
                    {...register('shipping_item_name')}
                  />
                  {errors.shipping_item_name && (
                    <span className="text-red-500 text-sm">
                      <>{errors.shipping_item_name?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Country of Origin</label>
                <div>
                  <Input placeholder="Country of Origin" className="bg-stone-100 border-0" 
                    error={errors && (errors.shipping_item_country_of_origin ? true : false)}
                    {...register('shipping_item_country_of_origin')}
                  />
                  {errors.shipping_item_country_of_origin && (
                    <span className="text-red-500 text-sm">
                      <>{errors.shipping_item_country_of_origin?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>HS Code</label>
                <div>
                  <Input placeholder="HS Code" className="bg-stone-100 border-0" 
                    error={errors && (errors.shipping_item_hs_code ? true : false)}
                    {...register('shipping_item_hs_code')}
                  />
                  {errors.shipping_item_hs_code && (
                    <span className="text-red-500 text-sm">
                      <>{errors.shipping_item_hs_code?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Quantity</label>
                <div>
                  <Input placeholder="Quantity" className="bg-stone-100 border-0" 
                    error={errors && (errors.shipping_item_quantity ? true : false)}
                    {...register('shipping_item_quantity')}
                  />
                  {errors.shipping_item_quantity && (
                    <span className="text-red-500 text-sm">
                      <>{errors.shipping_item_quantity?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-1/2">
                  <label>Weight</label>
                  <div>
                    <div 
                      className={cn(
                        "bg-stone-100 rounded-xl focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3",
                        errors && errors.shipping_item_weight && 'ring-2 ring-offset-2 ring-red-300 focus-within:ring-red-300'
                      )}
                    >
                      <input placeholder="0" className="px-3 py-2.5 text-sm bg-transparent outline-none w-full" 
                        {...register('shipping_item_weight')}
                      />
                      <span className="font-medium text-stone-500">kg</span>
                    </div>
                    {errors.shipping_item_weight && (
                      <span className="text-red-500 text-sm">
                        <>{errors.shipping_item_weight?.message}</>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <label>Unit Value</label>
                  <>
                    <div 
                      className={cn(
                        "bg-stone-100 rounded-xl focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3",
                        errors && errors.shipping_item_unit_value && 'ring-2 ring-offset-2 ring-red-300 focus-within:ring-red-300'
                      )}
                    >
                      <input placeholder="0" className="px-3 py-2.5 text-sm bg-transparent outline-none w-full" 
                        {...register('shipping_item_unit_value')}
                      />
                      <span className="font-medium text-stone-500">{currency || ''}</span>
                    </div>
                    {errors.shipping_item_unit_value && (
                      <span className="text-red-500 text-sm">
                        <>{errors.shipping_item_unit_value?.message}</>
                      </span>
                    )}
                  </>
                </div>
              </div>
            </div>

            <DialogFooter className="p-3">
              <Button variant={'ghost'} type="button"
                disabled={isSubmitting}
                onClick={onReset}
              >
                Reset
              </Button>
              <Button type="submit" 
                disabled={isSubmitting}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddCustomShippingItemModal);

type AddCustomShippingItemModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  _shipping_id: any
  onAdded?: (updatedItem?: any) => void
}