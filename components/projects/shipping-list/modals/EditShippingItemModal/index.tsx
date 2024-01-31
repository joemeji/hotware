import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { fetcher } from "@/utils/api.config";
import useSWR, { useSWRConfig } from "swr";
import { ShippingDetailsContext } from "@/context/shipping-details-context";

function EditShippingItemModal(props: EditShippingItemModalProps) {
  const { open, onOpenChange, item, _shipping_id, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const warehouse_id = shippingDetails ? shippingDetails.warehouse_id : null;
  const currency = shippingDetails ? shippingDetails.currency : null;
  const { mutate } = useSWRConfig();

  const uri = () => {
    if (!open) return null;
    if (!item) return null;
    if (item.shipping_item_is_set) return null;
    return `/api/item/${item._item_id}/inventory/${warehouse_id || ""}`;
  };

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const {
    data: inventory,
    isLoading: inventoryIsLoading,
    error: inventoryError,
  } = useSWR(uri(), fetcher, swrOptions);

  let _currentQuantity = inventory ? inventory.current_quantity : 0;
  const _isCustom = item
    ? !isNaN(item.is_custom)
      ? Number(item.is_custom)
      : 0
    : 0;

  const yupObject: any = {
    shipping_item_name: yup.string().required("Item Name is required"),
    shipping_item_quantity: yup
      .number()
      .min(1)
      .max(_currentQuantity, "Quantity must not greater to " + _currentQuantity)
      .typeError("Quantity must be a number")
      .required("Quantity is required"),
    shipping_item_weight: yup
      .number()
      .default(0)
      .typeError("Weight must be a number")
      .required("Weight is required"),
    shipping_item_hs_code: yup.string(),
    shipping_item_unit_value: yup.string().required("Unit Value is required"),
    shipping_item_country_of_origin: yup.mixed(),
  };

  if (_isCustom === 1) {
    yupObject.shipping_item_quantity = yup
      .number()
      .min(0, "Quantity must greater to 1")
      .typeError("Quantity must be a number");
    yupObject.shipping_item_weight = yup
      .number()
      .min(0)
      .typeError("Weight must be a number");
    yupObject.shipping_item_hs_code = yup.string();
    yupObject.shipping_item_unit_value = yup.string();
    yupObject.shipping_item_country_of_origin = yup.mixed();
  }

  if (item && item.shipping_item_is_set) {
    yupObject.shipping_item_quantity = yup
      .number()
      .min(item.shipping_item_quantity);
  }

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmitEditForm = async (data: any) => {
    if (Object.keys(errors).length > 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        _shipping_id,
        shipping_item_id: item.shipping_item_id,
        _item_id: item._item_id || null,
      };
      const res = await fetch(`/api/shipping/${_shipping_id}/item/update`, {
        method: "POST",
        body: JSON.stringify({ items: [payload] }),
      });
      const json = await res.json();
      if (json.success) {
        mutate(`/api/shipping/${_shipping_id}/items`);
        setIsSubmitting(false);
        onOpenChange && onOpenChange(false);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showInventory = () => {
    if (!item) return <></>;
    if (item.shipping_item_is_set) return <></>;
    if (_isCustom === 0)
      return (
        <span className="text-stone-500">
          ({_currentQuantity} availability)
        </span>
      );
    return <></>;
  };

  const onReset = () => {
    clearErrors();
    setValue("shipping_item_name", item.shipping_item_name);
    setValue("shipping_item_quantity", item.shipping_item_quantity);
    setValue("shipping_item_weight", item.shipping_item_weight);
    setValue("shipping_item_hs_code", item.shipping_item_hs_code);
    setValue("shipping_item_unit_value", item.shipping_item_unit_value);
    setValue(
      "shipping_item_country_of_origin",
      item.shipping_item_country_of_origin
    );
  };

  useEffect(() => {
    if (!open) clearErrors();
  }, [open, clearErrors]);

  useEffect(() => {
    if (item) {
      setValue("shipping_item_name", item.shipping_item_name);
      setValue("shipping_item_quantity", item.shipping_item_quantity);
      setValue("shipping_item_weight", item.shipping_item_weight);
      setValue("shipping_item_hs_code", item.shipping_item_hs_code);
      setValue("shipping_item_unit_value", item.shipping_item_unit_value);
      setValue(
        "shipping_item_country_of_origin",
        item.shipping_item_country_of_origin
      );
    }
  }, [item, setValue]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) =>
          !isSubmitting && onOpenChange && onOpenChange(open)
        }
      >
        <DialogContent
          forceMount
          className="max-w-[600px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Update Item</DialogTitle>
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
                <label>Item Name</label>
                <div>
                  <Textarea
                    placeholder="Item Name"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.shipping_item_name ? true : false)}
                    {...register("shipping_item_name")}
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
                  <Input
                    placeholder="Country of Origin"
                    className="bg-stone-100 border-0"
                    error={
                      errors &&
                      (errors.shipping_item_country_of_origin ? true : false)
                    }
                    {...register("shipping_item_country_of_origin")}
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
                  <Input
                    placeholder="HS Code"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.shipping_item_hs_code ? true : false)
                    }
                    {...register("shipping_item_hs_code")}
                  />
                  {errors.shipping_item_hs_code && (
                    <span className="text-red-500 text-sm">
                      <>{errors.shipping_item_hs_code?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Quantity {showInventory()}</label>
                <div>
                  <Input
                    placeholder="Quantity"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.shipping_item_quantity ? true : false)
                    }
                    disabled={item && item.shipping_item_is_set ? true : false}
                    {...register("shipping_item_quantity")}
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
                        "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3",
                        errors &&
                          errors.shipping_item_weight &&
                          "ring-2 ring-offset-2 ring-red-300 focus-within:ring-red-300"
                      )}
                    >
                      <input
                        placeholder="0"
                        className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
                        {...register("shipping_item_weight")}
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
                        "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3",
                        errors &&
                          errors.shipping_item_unit_value &&
                          "ring-2 ring-offset-2 ring-red-300 focus-within:ring-red-300"
                      )}
                    >
                      <input
                        placeholder="0"
                        className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
                        {...register("shipping_item_unit_value")}
                      />
                      <span className="font-medium text-stone-500">
                        {currency || ""}
                      </span>
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
              <Button
                variant={"ghost"}
                type="button"
                disabled={isSubmitting}
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(isSubmitting && "loading")}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(EditShippingItemModal);

type EditShippingItemModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  item: any;
  _shipping_id: any;
  onUpdated?: (updatedItem?: any) => void;
};
