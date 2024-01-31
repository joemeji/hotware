import { memo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Pencil, Plus, Trash } from "lucide-react";
import { ItemMenu } from "../items";
import AddCmsCategoryModal from "./modals/AddCmsCategoryModal";
import MoreOption from "../MoreOption";

function CategoryDropdown(props: CategoryDropdownProps) {
  const { onClickItem } = props;
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);

  return (
    <>
      {openAddCategoryModal && (
        <AddCmsCategoryModal
          open={openAddCategoryModal}
          onOpenChange={(open: any) => setOpenAddCategoryModal(open)}
        />
      )}
      <MoreOption
        menuTriggerChildren={
          <Button
            variant="outline"
            className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        }
      >
        <ItemMenu
          className="gap-2"
          onClick={() => setOpenAddCategoryModal(true)}
        >
          <Plus height={18} className="font-medium text-green-500" />
          <span className="font-medium">Add</span>
        </ItemMenu>
        <ItemMenu
          className="gap-2"
          onClick={() => onClickItem && onClickItem("edit")}
        >
          <Pencil height={18} className="font-medium text-orange-500" />
          <span className="font-medium">Edit</span>
        </ItemMenu>
        <ItemMenu
          className="gap-2"
          onClick={() => onClickItem && onClickItem("delete")}
        >
          <Trash height={18} className="font-medium text-rose-500" />
          <span className="font-medium">Delete</span>
        </ItemMenu>
      </MoreOption>
    </>
  );
}

export default memo(CategoryDropdown);

type CategoryDropdownProps = {
  onClickItem?: (loadingDetails: any) => void;
  access_token?: any;
};
