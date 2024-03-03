import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { memo, useContext } from "react";

const AddButtonPopover = (props: AddButtonPopoverProps) => {
  const { onClickAddEquipmentButton, onClickAddSetButton, loadingDetails } =
    props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center gap-2 px-2"
          disabled={loadingDetails !== null ? false : true}
        >
          <Plus className="h-[18px] w-[18px] text-red-600" strokeWidth={2} />{" "}
          Add Item
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-stone-100 py-2 px-0 w-auto">
        <div className="flex flex-col">
          <AddPopOverMenu
            title="Add Equipment"
            onClick={onClickAddEquipmentButton}
          />
          <AddPopOverMenu title="Add From Sets" onClick={onClickAddSetButton} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(AddButtonPopover);

type AddButtonPopoverProps = {
  onClickAddEquipmentButton?: () => void;
  onClickAddSetButton?: () => void;
  loadingDetails?: any;
};

export function AddPopOverMenu({
  title,
  iconImage,
  iconColor,
  iconBg,
  ...props
}: any) {
  return (
    <button
      className="hover:bg-stone-100 w-full py-2 px-3 font-medium flex gap-2 items-center"
      {...props}
    >
      <span>{title}</span>
    </button>
  );
}
