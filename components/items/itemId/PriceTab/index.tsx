import { TabType } from "..";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ItemValues from "./ItemValues";
import ListPrice from "./ListPrice";
import PurchasePrice from "./PurchasePrice";
import { useContext } from "react";
import { EquipmentContext } from "../Layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";

interface PriceTabType {
  currencies?: any;
}

export const actionMenu = [
  {
    name: "Edit",
    icon: (
      <Pencil
        className={cn("mr-2 h-[18px] w-[18px] text-blue-600")}
        strokeWidth={2}
      />
    ),
    actionType: "edit",
  },
  {
    name: "Delete",
    icon: (
      <Trash2
        className={cn("mr-2 h-[18px] w-[18px] text-red-600")}
        strokeWidth={2}
      />
    ),
    actionType: "delete",
  },
];

export default function PricesTab(props: PriceTabType) {
  const { currencies } = props;
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();

  return (
    <>
      <div className="mb-4">
        <ItemValues currencies={currencies} />
      </div>
      <div className="mb-4">
        <ListPrice
          _item_id={router.query.item_id}
          access_token={access_token}
          currencies={currencies}
        />
      </div>
      <PurchasePrice
        _item_id={router.query.item_id}
        access_token={access_token}
        currencies={currencies}
      />
    </>
  );
}

interface ModalType extends DialogPrimitive.DialogProps {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Modal(props: ModalType) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogPrimitive.Close
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            onClick={props.onClose}
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <div>{props.children}</div>
      </DialogContent>
    </Dialog>
  );
}
