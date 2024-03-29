import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { memo } from "react";

const AddButtonPopover = (props: AddButtonPopoverProps) => {
  const {
    onClickAddEquipmentButton,
    onClickAddCustomEquipment,
    onClickAddReceiptTotalButton,
    onClickAddTextBlockButton,
    onClickAdditionalHeaderTextButton,
  } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="shadow-2xl py-2.5 px-4 font-medium flex gap-2 items-center">
          <Plus className="w-[24px] h-[24px]" /> Add Item
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-stone-100 py-2 px-0 w-auto">
        <div className="flex flex-col">
          <AddPopOverMenu
            title="Add Equipment"
            onClick={onClickAddEquipmentButton}
          />
          <AddPopOverMenu
            title="Add Custom Equipment"
            onClick={onClickAddCustomEquipment}
          />
          <AddPopOverMenu
            title="Additional Header Text"
            onClick={onClickAdditionalHeaderTextButton}
          />
          <AddPopOverMenu
            title="Add Receipt Total"
            onClick={onClickAddReceiptTotalButton}
          />
          <AddPopOverMenu
            title="Add Text Block"
            onClick={onClickAddTextBlockButton}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(AddButtonPopover);

type AddButtonPopoverProps = {
  onClickAddEquipmentButton?: () => void;
  onClickAddCustomEquipment?: () => void;
  onClickAddReceiptTotalButton?: () => void;
  onClickAddTextBlockButton?: () => void;
  onClickAdditionalHeaderTextButton?: () => void;
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
