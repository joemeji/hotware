import { memo, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { ChevronDown, Edit, Pencil, Plus, QrCode, Trash } from "lucide-react";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddPopOverMenu } from "./ShippingDetails/AddButtonPopover";
import SortableItem from "./sortable-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useSWRConfig } from "swr";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { mutateIndex } from "@/services/shipping/item";

function CategoryItem(props: CategoryItemProps) {
  const {
    item,
    sensors,
    handleDragEnd,
    // onDelete,
    onRename,
    onAddExistingItem,
    onAddNewItem,
    openByDefault,
    children,
  } = props;
  const [open, setOpen] = useState(openByDefault || false);
  const { mutate } = useSWRConfig();
  const shippingData: any = useContext(ShippingDetailsContext);
  const [toDeleteCategory, setToDeleteCategory] = useState<any>(null);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>({});

  const onToggleCategoryEquipments = () => {
    setOpen(!open);
  };

  async function onDeleteCategory(forceDelete = false) {
    const _category = { ...item };
    delete _category.equipments;
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          shipping_category_id: item.shipping_category_id,
          shipping_id: shippingData?._shipping_id,
          delete: forceDelete,
        }),
      };
      setToDeleteCategory(_category);
      const res = await fetch(
        `/api/shipping/${shippingData?._shipping_id}/category/delete`,
        options
      );
      const json = await res.json();

      if (json && !json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }

      if (json.success) {
        toast({
          title: "Successfully deleted.",
          variant: "success",
          duration: 2000,
        });
        mutate(mutateIndex(shippingData?._shipping_id));
      }
    } catch (err: any) {
      toast({
        title: "Error: " + err.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  }

  return (
    <>
      <AlertDialog
        open={openAlertMessage}
        onOpenChange={(open) => {
          setOpenAlertMessage(open);
          if (!open) setToDeleteCategory(null);
        }}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertMessage && alertMessage.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage && (
                <span
                  dangerouslySetInnerHTML={{ __html: alertMessage.description }}
                />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toDeleteCategory && onDeleteCategory(true);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SortableItem
        key={item.uuid}
        id={item.uuid}
        type="category"
        className={cn("bg-white p-1 rounded-xl")}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => handleDragEnd(event, item.uuid)}
        >
          <>
            <div
              className={cn(
                "py-4 ps-2 pe-1 flex items-center justify-between relative bg-white rounded-sm",
                open && item.equipments && item.equipments.length > 0
              )}
            >
              <div className="flex gap-2">
                <div className="w-[15px] h-[15px] bg-blue-300 rounded-full mt-1" />
                <span className="text-stone-800 font-medium">
                  {item.shipping_category_name}
                </span>
              </div>
              <div className="flex items-center gap-1 absolute right-0 h-full pe-1">
                {item.equipments && item.equipments.length > 0 && (
                  <button
                    className="hover:bg-stone-100 p-1 rounded-sm"
                    onClick={onToggleCategoryEquipments}
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        open && "-rotate-180"
                      )}
                      strokeWidth={1}
                    />
                  </button>
                )}
                <Popover>
                  <PopoverTrigger className="hover:bg-stone-100 p-1 rounded-sm">
                    <Plus
                      className={cn("h-5 w-5 transition-all duration-300")}
                      strokeWidth={1}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="border-stone-100 py-2 px-0 w-auto">
                    <div className="flex flex-col">
                      <AddPopOverMenu
                        title="Add new"
                        iconColor="text-purple-500"
                        iconBg="bg-purple-500/10"
                        onClick={onAddNewItem}
                      />
                      <AddPopOverMenu
                        title="Existing Items"
                        iconColor="text-yellow-500"
                        iconBg="bg-yellow-500/10"
                        onClick={onAddExistingItem}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <MoreOption>
                  <ItemMenu onClick={onRename}>
                    <Edit
                      className={cn("mr-2 h-[18px] w-[18px]")}
                      strokeWidth={1}
                    />
                    <span className="font-medium">Rename</span>
                  </ItemMenu>
                  <ItemMenu onClick={() => onDeleteCategory(false)}>
                    <Trash
                      className={cn("mr-2 h-[18px] w-[18px]")}
                      strokeWidth={1}
                    />
                    <span className="font-medium">Delete</span>
                  </ItemMenu>
                </MoreOption>
              </div>
            </div>
            {item.equipments && item.equipments.length > 0 && (
              <ScrollArea
                className="h-0 border-l"
                style={{
                  height: open ? "100%" : 0,
                  // paddingTop: !open ? 0 : '4px',
                  // paddingBottom: !open ? 0 : '4px',
                }}
              >
                <div className="flex flex-col gap-1 ps-3 pb-2 pe-2 bg-stone-100 pt-2">
                  {children}
                </div>
              </ScrollArea>
            )}
          </>
        </DndContext>
      </SortableItem>
    </>
  );
}

export default memo(CategoryItem);

type CategoryItemProps = {
  item?: any;
  sensors?: any;
  handleDragEnd?: any;
  access_token?: any;
  onDelete?: any;
  onRename?: any;
  onAddExistingItem?: () => void;
  onAddNewItem?: () => void;
  openByDefault?: boolean;
  onClickEditItem?: (item: any) => void;
  onClickAddSN?: (item: any, serial_numbers: any) => void;
  children: React.ReactNode;
};
