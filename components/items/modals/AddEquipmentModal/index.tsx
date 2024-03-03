import ItemCategorySelect from "@/components/app/item-category-select";
import ItemMainCategorySelect from "@/components/app/item-main-category-select";
import ItemSubCategorySelect from "@/components/app/item-sub-category-select";
import ItemUnitSelect from "@/components/app/item-unit-select";
import WarehouseSelect from "@/components/app/warehouse-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputFile from "@/components/ui/input-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as yup from "yup";
import formSchema from "./formSchema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { AccessTokenContext } from "@/context/access-token-context";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type AddEquipmentModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: () => void;
};

const AddEquipmentModal = ({
  open,
  onOpenChange,
  onSuccess,
}: AddEquipmentModal) => {
  const [itemImageFile, setItemImageFile] = useState(null);
  const [item_main_category_id, set_item_main_category_id] = useState(null);
  const [item_category_id, set_item_category_id] = useState(null);
  const access_token = useContext(AccessTokenContext);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmitForm = async (data: any) => {
    const formData = new FormData();

    const payload = { ...data };

    setSubmitting(true);

    if (payload.has_serial_number) payload.has_serial_number = 1;
    else payload.has_serial_number = 0;

    if (payload.equipment_category) payload.equipment_category = 1;
    else payload.equipment_category = 0;

    if (itemImageFile) payload.item_file = itemImageFile;

    for (let [key, value] of Object.entries(payload)) {
      formData.append(key, value as string);
    }

    try {
      const res = await fetch(`${baseUrl}/api/items/create`, {
        method: "POST",
        body: formData,
        headers: authHeaders(access_token, true),
      });
      const json = await res.json();

      if (json.success) {
        toast({
          title: "New project added successfully.",
          variant: "success",
          duration: 2000,
        });
        onSuccess && onSuccess();
        reset();
        onOpenChange && onOpenChange(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };
  const onChangeMainCategory = (id: any) => {
    set_item_main_category_id(id);
    set_item_category_id(null);
    setValue("item_category_id", "");
    setValue("item_sub_category_id", "");
  };

  useEffect(() => {
    setValue("item_used_value", 0);
    setValue("item_new_value", 0);
    setValue("item_weight", 0);
    setValue("item_height", 0);
    setValue("item_length", 0);
    setValue("item_width", 0);
    setValue("item_quantity", 0);
  }, [setValue]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!submitting) onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[750px] p-0 overflow-auto gap-0 ">
          <ScrollArea viewPortClassName="max-h-[90vh]">
            <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white/50 backdrop-blur-sm z-10">
              <DialogTitle>Add Equipment</DialogTitle>
              <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                <X />
              </DialogPrimitive.Close>
            </DialogHeader>
            <form
              className="flex flex-col gap-4 items-end"
              onSubmit={handleSubmit(onSubmitForm)}
            >
              <div className="w-full flex flex-col gap-4 p-4">
                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>Main Category</label>
                      <Controller
                        control={control}
                        name="item_main_category_id"
                        render={({ field }) => (
                          <ItemMainCategorySelect
                            value={field.value}
                            onChangeValue={(value) => {
                              field.onChange(value);
                              onChangeMainCategory(value);
                            }}
                            error={errors?.item_main_category_id}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Category</label>
                      <Controller
                        control={control}
                        name="item_category_id"
                        render={({ field }) => (
                          <ItemCategorySelect
                            value={field.value}
                            onChangeValue={(value) => {
                              field.onChange(value);
                              set_item_category_id(value);
                            }}
                            item_main_category_id={item_main_category_id}
                            error={errors?.item_category_id}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Sub Category</label>
                  <Controller
                    control={control}
                    name="item_sub_category_id"
                    render={({ field }) => (
                      <ItemSubCategorySelect
                        value={field.value}
                        onChangeValue={(value) => field.onChange(value)}
                        item_category_id={item_category_id}
                        error={errors?.item_sub_category_id}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Item Name</label>
                  <Input
                    placeholder="Item Name"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.item_name ? true : false)}
                    {...register("item_name")}
                  />
                  {errors.item_name && (
                    <span className="text-red-500 text-sm">
                      <>{errors.item_name?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Description</label>
                  <Textarea
                    placeholder="Description"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.item_description ? true : false)}
                    {...register("item_description")}
                  />
                  {errors.item_description && (
                    <span className="text-red-500 text-sm">
                      <>{errors.item_description?.message}</>
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>Unit</label>
                      <Controller
                        control={control}
                        name="item_unit"
                        render={({ field }) => (
                          <ItemUnitSelect
                            value={field.value}
                            onChangeValue={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Weight</label>
                      <Input
                        placeholder="Weight"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_weight ? true : false)}
                        {...register("item_weight")}
                      />
                      {errors.item_weight && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_weight?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>Height</label>
                      <Input
                        placeholder="Height"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_height ? true : false)}
                        {...register("item_height")}
                      />
                      {errors.item_height && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_height?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Length</label>
                      <Input
                        placeholder="Length"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_length ? true : false)}
                        {...register("item_length")}
                      />
                      {errors.item_length && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_length?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>Width</label>
                      <Input
                        placeholder="Width"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_width ? true : false)}
                        {...register("item_width")}
                      />
                      {errors.item_width && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_width?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>New Value</label>
                      <Input
                        placeholder="New Value"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_new_value ? true : false)}
                        {...register("item_new_value")}
                      />
                      {errors.item_new_value && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_new_value?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Used Value</label>
                      <Input
                        placeholder="Used Value"
                        className="bg-stone-100 border-0"
                        error={
                          errors && (errors.item_used_value ? true : false)
                        }
                        {...register("item_used_value")}
                      />
                      {errors.item_used_value && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_used_value?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>Quantity</label>
                      <Input
                        placeholder="Quantity"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_quantity ? true : false)}
                        {...register("item_quantity")}
                      />
                      {errors.item_quantity && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_quantity?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Warehouse</label>
                      <Controller
                        control={control}
                        name="item_warehouse"
                        render={({ field }) => (
                          <WarehouseSelect
                            value={field.value}
                            onChangeValue={(value) => field.onChange(value)}
                            error={errors?.item_warehouse}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2 ">
                    <div className="flex flex-col gap-1">
                      <label>HS Code</label>
                      <Input
                        placeholder="HS Code"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_hs_code ? true : false)}
                        {...register("item_hs_code")}
                      />
                      {errors.item_hs_code && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_hs_code?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col gap-1">
                      <label>Origin</label>
                      <Input
                        placeholder="Origin"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.item_origin ? true : false)}
                        {...register("item_origin")}
                      />
                      {errors.item_origin && (
                        <span className="text-red-500 text-sm">
                          <>{errors.item_origin?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label>With Serial Number</label>
                    <Controller
                      control={control}
                      name="has_serial_number"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1  w-1/2">
                    <label>Sold Item</label>
                    <Controller
                      control={control}
                      name="equipment_category"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label>
                    Upload Image (Try to minimize the image size to be uploaded)
                  </label>
                  <InputFile
                    onChange={(files: any) => {
                      if (Array.isArray(files)) setItemImageFile(files[0]);
                    }}
                    accept="image/png, image/gif, image/jpeg, image/jpg"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 px-4 py-3 bg-background/30 text-right w-full backdrop-blur-sm z-10">
                <Button
                  type="submit"
                  className={cn("rounded-xl", submitting && "loading")}
                  disabled={submitting}
                >
                  Add Equipment
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEquipmentModal;
