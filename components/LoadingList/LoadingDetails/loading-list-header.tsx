import MoreOption from "@/components/MoreOption";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ItemMenu, loadingHeaderMenu } from "..";
import { AddNewHeadingListModal } from "../modals/AddNewHeadingModal";
import { LoadingListDetailsContext } from "@/pages/projects/loading-list";
import dynamic from "next/dynamic";
import AddItemFromTemplateModal from "../modals/AddItemFromTemplateModal";
import { AddNewCopyLoadingList } from "../modals/AddNewCopyLoadingModal";
import AddButtonPopover from "../FormElements/AddButtonPopover";
import AddItemSetModal from "../modals/AddItemSetModal";

const AddEquipmentModal = dynamic(() => import('@/components/LoadingList/modals/AddEquipmentModal'));

export const LoadingListHeader = () => {
  const [addNewHeadingModal, setAddNewHeadingModal] = useState(false);
  const [addNewEquipmentModal, setAddNewEquipmentModal] = useState(false);
  const [itemCategory, setItemCategory] = useState(null);
  const [existingEquipmentOnly, setExistingEquipmentOnly] = useState(false);
  const [existingEquipments, setExistingEquipments] = useState(null);
  const [addItemFromTemplateModal, setAddItemFromTemplateModal] = useState(false);
  const [addNewCopyLoadingModal, setAddNewCopyLoadingModal] = useState(false);
  const [openItemSetModal, setOpenItemSetModal] = useState(false);
  const loadingDetails: any = useContext(LoadingListDetailsContext);

  const handleAddNewHeading = () => {
    setAddNewHeadingModal(true);
  }

  const handleAddNewEquipment = () => {
    setAddNewEquipmentModal(true);
  }

  const handleAddItemFromTemplate = (menu: any) => {
    const loading_id = loadingDetails && loadingDetails.loading_id;
    if (menu.actionType == 'add-from-template') {
      setAddItemFromTemplateModal(true);
    } else if (menu.actionType == 'new-copy') {
      setAddNewCopyLoadingModal(true);
    } else if (menu.actionType == 'preview') {
      window.open(
        "/projects/loading-list/" + loading_id + "/preview",
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  useEffect(() => {
    if (!addNewEquipmentModal) {
      setItemCategory(null);
      setExistingEquipments(null);
      setTimeout(() => {
        setExistingEquipmentOnly(false);
      }, 300);
    }
  }, [addNewEquipmentModal]);

  return (
    <>
      {openItemSetModal && (
        <AddItemSetModal
          onOpenChange={setOpenItemSetModal}
          open={openItemSetModal}
        />
      )}
      {addNewHeadingModal && (
        <AddNewHeadingListModal
          open={addNewHeadingModal}
          onOpenChange={(open: any) => setAddNewHeadingModal(open)}
          loadingID={loadingDetails && loadingDetails.loading_id}
        />
      )}
      {
        addNewEquipmentModal && (
          <AddEquipmentModal
            open={addNewEquipmentModal}
            onOpenChange={(open: any) => setAddNewEquipmentModal(open)}
            loading_id={loadingDetails && loadingDetails.loading_id}
            excludedEquipments={[]}
            itemCategory={itemCategory}
            existingEquipmentOnly={existingEquipmentOnly}
            existingEquipments={existingEquipments}
          />
        )}
      {addItemFromTemplateModal && (
        <AddItemFromTemplateModal
          open={addItemFromTemplateModal}
          onOpenChange={(open: any) => setAddItemFromTemplateModal(open)}
          loadingWorkID={loadingDetails && loadingDetails.loading_work_id}
          loadingID={loadingDetails && loadingDetails.loading_id}
        />
      )}
      {addNewCopyLoadingModal && (
        <AddNewCopyLoadingList
          open={addNewCopyLoadingModal}
          onOpenChange={(open: any) => setAddNewCopyLoadingModal(open)}
          loadingID={loadingDetails && loadingDetails.loading_id}
        />
      )}

      <div className="p-4 flex justify-between items-center">
        <p className="font-medium text-lg">Items <span className="text-base text-slate-400">{loadingDetails && '(' + loadingDetails.loading_description + ')'}</span></p>
        <div className="flex items-center">
          <AddButtonPopover
            onClickAddEquipmentButton={handleAddNewEquipment}
            onClickAddSetButton={() => setOpenItemSetModal(true)}
            loadingDetails={loadingDetails}
          />
          <Button variant={'ghost'} className="flex items-center gap-2 px-2" onClick={handleAddNewHeading} disabled={loadingDetails !== null ? false : true}>
            <Plus
              className="h-[18px] w-[18px] text-green-600"
              strokeWidth={2}
            /> New Heading
          </Button>
          <MoreOption>
            {[...loadingHeaderMenu].map((option: any, key: number) => {
              if (loadingDetails !== null) {
                return (
                  <ItemMenu key={key} onClick={(menu: any) => handleAddItemFromTemplate(option)}>
                    {option.icon}
                    <span className="font-medium">{option.name}</span>
                  </ItemMenu>
                );
              }
              return null; // or any other fallback, e.g., an empty fragment <> </>
            })}
          </MoreOption>
        </div>
      </div>
    </>
  )
}