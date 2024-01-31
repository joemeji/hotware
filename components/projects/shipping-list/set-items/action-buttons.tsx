import { ItemMenu } from "@/components/items";
import { cn } from "@/lib/utils";
import { MinusCircle, Pencil, Trash } from "lucide-react";
import MoreOption from "@/components/MoreOption";
import EditShippingItemModal from "../modals/EditShippingItemModal";
import { useContext, useState } from "react";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { deleteShippingItemApi, mutateIndex } from "@/services/shipping/item";
import { mutateIndex as mutateIndexSet } from "@/services/shipping/set";
import { useSWRConfig } from "swr";
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

export default function ActionButtons({ item }: { item: any }) {
  const shippingData: any = useContext(ShippingDetailsContext);
  const [isEditItem, setIsEditItem] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>({});
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const { mutate: mutateConfig } = useSWRConfig();

  const onDelete = async (isDelete = false) => {
    try {
      const json = await deleteShippingItemApi(shippingData?._shipping_id, {
        shipping_item_id: item.shipping_item_id,
        isDelete,
      });
      if (json && !json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
      if (json && json.success) {
        mutateConfig(mutateIndexSet(shippingData?._shipping_id, item?.shipping_item_id));
        mutateConfig(mutateIndex(shippingData?._shipping_id));
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <AlertDialog
        open={openAlertMessage}
        onOpenChange={(open) => {
          setOpenAlertMessage(open);
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
              onClick={() => onDelete(true)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isEditItem && (
        <EditShippingItemModal 
          item={item}
          _shipping_id={shippingData?._shipping_id}
          onOpenChange={setIsEditItem}
          open={isEditItem}
        />
      )}
      
      <MoreOption>
        <EditButton item={item} onEdit={() => setIsEditItem(true)} />
        <DeleteButton item={item} onDelete={() => onDelete(false)} />
        <UnCategorizedButton item={item} />
      </MoreOption>
    </>
  );
}

export const EditButton = ({
  item,
  onEdit,
}: {
  item: any;
  onEdit?: () => void;
}) => {
  return (
    <ItemMenu onClick={onEdit}>
      <Pencil className={cn("mr-2 h-[18px] w-[18px]")} strokeWidth={1} />
      <span className="font-medium">Edit</span>
    </ItemMenu>
  );
};

export const DeleteButton = ({
  item,
  onDelete,
}: {
  item: any;
  onDelete?: () => void;
}) => {
  return (
    <ItemMenu onClick={onDelete}>
      <Trash className={cn("mr-2 h-[18px] w-[18px]")} strokeWidth={1} />
      <span className="font-medium">Delete</span>
    </ItemMenu>
  );
};

export const UnCategorizedButton = ({ item }: { item: any }) => {
  const shiipingData: any = useContext(ShippingDetailsContext);
  const {mutate} = useSWRConfig();

  const onUncategorized = async () => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ 
          items: [{
            _item_id: item._item_id,
            shipping_item_id: item.shipping_item_id,
            shipping_category_id: null
          }] 
        })
      };
      const res = await fetch(`/api/shipping/${shiipingData?._shipping_id}/item/update`, options);
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        mutate(mutateIndex(shiipingData?._shipping_id));
      }
    }
    catch(err: any) {}
  };

  return item?.shipping_category_id ? (
    <ItemMenu onClick={onUncategorized}>
      <MinusCircle className={cn("mr-2 h-[18px] w-[18px]")} strokeWidth={1} />
      <span className="font-medium">Uncategorized</span>
    </ItemMenu>
  ) : (
    <></>
  );
};
