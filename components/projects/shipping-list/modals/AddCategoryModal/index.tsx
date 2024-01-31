import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authHeaders, baseUrl } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useSWRConfig } from "swr";

function AddCategoryModal(props: AddCategoryType) {
  const {
    open,
    onOpenChange,
    shipping_id,
    access_token,
    onError,
    category_update,
  } = props;
  const [categoryName, setCategoryName] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { mutate } = useSWRConfig();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        baseUrl + "/api/projects/shipping/category/save",
        {
          method: "POST",
          body: JSON.stringify({
            shipping_id,
            shipping_category_name: categoryName,
            shipping_category_id: category_update
              ? category_update.shipping_category_id
              : null,
          }),
          headers: { ...authHeaders(access_token) },
        }
      );
      const json = await res.json();

      if (json && !json.success && json.message) {
        setErrorMessage(json.message);
        setLoadingSubmit(false);
      }

      if (json && json.success) {
        mutate(`/api/shipping/${shipping_id}/items`);
        setLoadingSubmit(false);
        setErrorMessage(null);
        onOpenChange && onOpenChange(false);
        setCategoryName(null);
      }
    } catch (err: any) {
      onError && onError(err);
      setLoadingSubmit(false);
      setErrorMessage(null);
      toast({
        title: err.message,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (category_update) {
      setCategoryName(category_update.shipping_category_name);
    }
  }, [category_update]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            {category_update ? "Update" : "Add"} Category
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form className="p-5 flex flex-col gap-4 items-end" onSubmit={onSubmit}>
          <div className="w-full">
            <Input
              placeholder="Category Name"
              value={categoryName || ""}
              onChange={(e: any) => setCategoryName(e.target.value)}
              className="bg-stone-100 border-transparent"
              error={errorMessage ? true : false}
            />
            {errorMessage && (
              <span className="text-red-500">{errorMessage}</span>
            )}
          </div>
          <Button
            type="submit"
            className={cn(loadingSubmit && "loading")}
            disabled={!categoryName || loadingSubmit}
          >
            {category_update ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddCategoryModal);

type AddCategoryType = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  access_token: string | any;
  shipping_id: any;
  onError?: (error: any) => any;
  category_update?: any;
};

export type ShippingCategory = {
  shipping_category_id?: any;
  shipping_category_position?: any;
  shipping_category_name?: any;
};
