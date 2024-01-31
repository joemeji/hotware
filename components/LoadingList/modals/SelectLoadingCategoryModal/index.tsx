import AddLoadingCategoryModal, { LoadingCategory } from "../AddLoadingCategoryModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Fragment, memo, useCallback, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import useSWR from 'swr';
import { fetchApi, fetcher } from "@/utils/api.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

function SelectLoadingCategoryModal(props: SelectLoadingCategoryModal) {
  const {
    loading_id,
    access_token,
    open,
    onOpenChange,
    onSelectedCategory
  } = props

  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const { data, isLoading, error } = useSWR(open ? '/api/loading-list/' + loading_id + '/loading-items/category/get_categories' : null, fetcher, swrOptions);

  const handleOnSelectCategory = useCallback(() => {
    if (data && selectedCategory) {
      const _selectedCategory = data.find((item: LoadingCategory) => item.loading_category_id === selectedCategory);
      onSelectedCategory && onSelectedCategory(_selectedCategory);
      onOpenChange && onOpenChange(false);
    }
  }, [selectedCategory, data, onOpenChange, onSelectedCategory]);

  useEffect(() => {
    if (open) setSelectedCategory(null);
  }, [open]);

  return (
    <Fragment>
      <AddLoadingCategoryModal
        open={openAddCategoryModal}
        onOpenChange={(open: any) => setOpenAddCategoryModal(open)}
        access_token={access_token}
        loading_id={loading_id}
      />
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-[500px] p-0 overflow-auto gap-0 ">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10 border-b">
            <DialogTitle>
              Select Category
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <ScrollArea className="h-[350px]">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <Skeleton className="w-[200px] h-[15px]" />
                <Skeleton className="w-[80px] h-[15px]" />
              </div>
            )}

            {data && Array.isArray(data) && data.length === 0 && (
              <div className="flex justify-center">
                <Image
                  src="/images/No data-rafiki.svg"
                  width={300}
                  height={300}
                  alt="No Data to Shown"
                />
              </div>
            )}

            {data && (
              <RadioGroup onValueChange={(value) => setSelectedCategory(value)} className="px-2 py-3 gap-0">
                {Array.isArray(data) && data.map((category: LoadingCategory, key: number) => (
                  <label key={key} htmlFor={category.loading_category_id}
                    className={cn(
                      "flex items-center space-x-2 py-3 px-4",
                      "rounded-xl hover:bg-stone-100 cursor-pointer",
                      selectedCategory === category.loading_category_id && 'pointer-events-none bg-stone-100'
                    )}
                  >
                    <RadioGroupItem value={category.loading_category_id} id={category.loading_category_id} className="w-5 h-5 border-2" />
                    <span className="font-medium">{category.loading_category_name}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </ScrollArea>
          <div className="flex gap-2 border-t border-t-stone-200 justify-between p-3">
            <div>
              <Button variant={'secondary'} className="flex gap-2 items-center" onClick={() => setOpenAddCategoryModal(true)}>
                Add <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                disabled={!selectedCategory}
                onClick={handleOnSelectCategory}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default memo(SelectLoadingCategoryModal);

type SelectLoadingCategoryModal = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  access_token?: string
  loading_id: string
  onSelectedCategory?: (category: LoadingCategory) => void
}