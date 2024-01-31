import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSWRConfig } from "swr";
import VatSelect from "@/components/app/vat-select";
import { useSession } from "next-auth/react";

function AddCustomItemModal(props: AddCustomItemModalProps) {
  const { data: session }: any = useSession();
  const {
    open,
    onOpenChange,
    _offer_id,
    onAdded,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const yupSchema = yup.object({
    offer_item_number: yup.string(),
    offer_item_name: yup.string().required("Item Name is required"),
    offer_item_quantity: yup
      .number()
      .min(1, "Quantity must greater to 1")
      .typeError("Quantity must be a number"),
    offer_item_price: yup.number().min(0).typeError("Weight must be a number"),
    offer_item_vat: yup.number(),
    offer_item_discount: yup
      .number()
      .min(0)
      .typeError("Weight must be a number"),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      offer_item_number: "",
      offer_item_name: "",
      offer_item_quantity: 1,
      offer_item_price: 0,
      offer_item_vat: 0,
      offer_item_discount: 0,
    },
  });

  const onSubmitEditForm = async (data: any) => {
    if (Object.keys(errors).length > 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        _offer_id,
        _item_id: null,
      };
      const options = {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify({ items: [payload] }),
      };
      const res = await fetch(
        baseUrl + `/api/projects/offers/items/create/${_offer_id}`,
        options
      );
      const json = await res.json();
      setIsSubmitting(false);
      onOpenChange && onOpenChange(false);
      if (json.success) {
        onAdded && onAdded(json.items[0]);
        mutate([
          `/api/projects/offers/items/${_offer_id}`,
          session?.user?.access_token,
        ]);
        onReset();
      }
    }
    catch(err: any) {
      setIsSubmitting(false);
    }
  };

  const onReset = () => {
    clearErrors();
    setValue("offer_item_number", "");
    setValue("offer_item_name", "");
    setValue("offer_item_quantity", 1);
    setValue("offer_item_price", 0);
    setValue("offer_item_vat", 0);
    setValue("offer_item_discount", 0);
  };

  useEffect(() => {
    if (!open) clearErrors();
  }, [open, clearErrors]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) =>
          !isSubmitting && onOpenChange && onOpenChange(open)
        }
      >
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Create Custom Item</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEditForm)}>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-2">
                <label>Article No.</label>
                <div>
                  <Input
                    placeholder="Article No."
                    className="bg-stone-100 border-0"
                    error={errors && (errors.offer_item_number ? true : false)}
                    {...register("offer_item_number")}
                  />
                  {errors.offer_item_number && (
                    <span className="text-red-500 text-sm">
                      <>{errors.offer_item_number?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Equipment</label>
                <div>
                  <Textarea
                    placeholder="Item Name"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.offer_item_name ? true : false)}
                    {...register("offer_item_name")}
                  />
                  {errors.offer_item_name && (
                    <span className="text-red-500 text-sm">
                      <>{errors.offer_item_name?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Quantity</label>
                <div>
                  <Input
                    placeholder="Quantity"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.offer_item_quantity ? true : false)
                    }
                    {...register("offer_item_quantity")}
                  />
                  {errors.offer_item_quantity && (
                    <span className="text-red-500 text-sm">
                      <>{errors.offer_item_quantity?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Unit Price</label>
                <div>
                  <Input
                    placeholder="Unit Price"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.offer_item_price ? true : false)}
                    {...register("offer_item_price")}
                  />
                  {errors.offer_item_price && (
                    <span className="text-red-500 text-sm">
                      <>{errors.offer_item_price?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>VAT</label>
                <Controller
                  name="offer_item_vat"
                  control={control}
                  render={({ field }) => (
                    <VatSelect
                      modal={true}
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.offer_item_vat}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Discount</label>
                <div>
                  <Input
                    placeholder="Quantity"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.offer_item_discount ? true : false)
                    }
                    {...register("offer_item_discount")}
                  />
                  {errors.offer_item_discount && (
                    <span className="text-red-500 text-sm">
                      <>{errors.offer_item_discount?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="p-3">
              <Button
                variant={"ghost"}
                type="button"
                disabled={isSubmitting}
                onClick={onReset}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddCustomItemModal);

type AddCustomItemModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _offer_id: any;
  onAdded?: (updatedItem?: any) => void;
};