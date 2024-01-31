import useSWR from "swr";
import { fetcher } from "@/utils/api.config";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import uniqid from "@/utils/text";
import { useRouter } from "next/router";
import CategoryItem from "@/components/projects/shipping-list/category-item";
import Image from "next/image";
import AddButtonPopover from "@/components/projects/shipping-list/ShippingDetails/AddButtonPopover";
import TableHead from "@/components/projects/shipping-list/ShippingDetails/TableHead";
import dynamic from "next/dynamic";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemList } from "../sortable-item/item-list";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllItems,
  shippingItemSlice,
} from "@/store/reducer/shippingItemReducer";
import { AppState } from "@/store";
import EditShippingItemModal from "../modals/EditShippingItemModal";
import QrCodeScanner from "./QrCodeScanner";
import DetailsHeader from "../ShippingDetails/DetailsHeader";
import { ACTIVE } from "@/lib/shipping";
import { mutateIndex } from "@/services/shipping/item";
import { SetItem } from "../set-items";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GripVertical } from "lucide-react";

// modals
const AddCustomShippingItemModal = dynamic(
  () =>
    import(
      "@/components/projects/shipping-list/modals/AddCustomShippingItemModal"
    )
);
const AddItemSetModal = dynamic(
  () => import("@/components/projects/shipping-list/modals/AddItemSetModal")
);
const AddSerialNumberModal = dynamic(
  () =>
    import("@/components/projects/shipping-list/modals/AddSerialNumberModal")
);
const AddCategoryModal = dynamic(
  () => import("@/components/projects/shipping-list/modals/AddCategoryModal")
);
const AddEquipmentModal = dynamic(
  () => import("@/components/projects/shipping-list/modals/AddEquipmentModal")
);

function ShippingItemContent({ access_token }: any) {
  const router = useRouter();
  const [addEquipmentOpenModal, setAddEquipmentOpenModal] = useState(false);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [itemCategory, setItemCategory] = useState(null);
  const [existingEquipmentOnly, setExistingEquipmentOnly] = useState(false);
  const [existingEquipments, setExistingEquipments] = useState(null);
  const [openSNModal, setOpenSnModal] = useState(false);
  const [selectedItemForAddSnModal, setSelectedItemForAddSnModal] =
    useState<any>(null);
  const [openCustomAddShippingItemModal, setOpenCustomAddShippingItemModal] =
    useState(false);
  const [category_update, set_category_update] = useState(null);
  const [openItemSetModal, setOpenItemSetModal] = useState(false);
  const [addedSerialNumbers, setAddedSerialNumbers] = useState([]);
  const shippingData: any = useContext(ShippingDetailsContext);
  const dispatch = useDispatch();
  const shippingItems: any = useSelector(
    (state: AppState) => state[shippingItemSlice.name]
  );
  const [editItem, setEditItem] = useState<any>(null);
  const [isEditItem, setIsEditItem] = useState(false);
  const shipping_status = shippingData ? shippingData.shipping_status : null;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error, mutate } = useSWR(
    mutateIndex(router.query.shipping_id),
    fetcher,
    swrOptions
  );

  function onAddNewItem(category: any) {
    const _category = { ...category };
    const payload: any = {
      shipping_category_id: _category.shipping_category_id,
      shipping_category_name: _category.shipping_category_name,
      shipping_category_position: _category.shipping_category_position,
      shipping_id: _category.shipping_id,
    };
    setAddEquipmentOpenModal(true);
    setItemCategory(payload);
  }

  function onAddExistingItem(category: any) {
    const _dataItems = [...dataItems];
    const _category = { ...category };
    const filteredDataItems: any =
      _dataItems.filter((item: any) => !item.shipping_category_id) || [];
    const payload: any = {
      shipping_category_id: _category.shipping_category_id,
      shipping_category_name: _category.shipping_category_name,
      shipping_category_position: _category.shipping_category_position,
      shipping_id: _category.shipping_id,
    };
    setItemCategory(payload);
    setExistingEquipmentOnly(true);
    setAddEquipmentOpenModal(true);
    setExistingEquipments(
      filteredDataItems.map((item: any) => {
        const _item = { ...item };
        if (!item._item_id) {
          _item._item_id = uniqid();
          _item.is_custom = true;
        }
        return _item;
      })
    );
  }

  const onClickAddEquipment = useCallback(() => {
    setAddEquipmentOpenModal(!addEquipmentOpenModal);
  }, [addEquipmentOpenModal]);

  const onClickAddSN = (item: any, serial_numbers: any) => {
    setOpenSnModal(true);
    setSelectedItemForAddSnModal(item);
    setAddedSerialNumbers(serial_numbers);
  };

  const dataItems = useMemo(() => {
    let _dataItems: any = [];
    if (
      shippingItems &&
      shippingItems.categories &&
      shippingItems.categories.length > 0
    ) {
      shippingItems.categories.forEach((cateItem: any) => {
        const equipments = shippingItems.equipments.filter(
          (item: any) =>
            item.shipping_category_id === cateItem.shipping_category_id
        );
        _dataItems.push({
          ...cateItem,
          equipments: equipments.map((item: any) => ({
            ...item,
          })),
        });
      });
    }
    if (
      data &&
      shippingItems.equipments &&
      shippingItems.equipments.length > 0
    ) {
      const equipments = shippingItems.equipments.filter(
        (item: any) => item.shipping_category_id === null
      );
      _dataItems.push(...equipments);
    }
    _dataItems = [..._dataItems].map((item: any) => ({ ...item }));
    return _dataItems;
  }, [shippingItems, data]);

  useEffect(() => {
    if (data) {
      dispatch(
        setAllItems({
          equipments: data.equipments?.map((item: any) => ({
            ...item,
            open: false,
          })),
          categories: data.categories,
        })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!addEquipmentOpenModal) {
      setItemCategory(null);
      setExistingEquipments(null);
      setTimeout(() => {
        setExistingEquipmentOnly(false);
      }, 300);
    }
  }, [addEquipmentOpenModal]);

  const handleDrop = async (droppedItem: any) => {
    if (!droppedItem.destination) return;

    let _dataItems = [...dataItems];

    const [removed] = _dataItems.splice(droppedItem.source.index, 1);
    _dataItems.splice(droppedItem.destination.index, 0, removed);

    const shippingItems = _dataItems.filter(
      (item: any) => typeof item.shipping_item_id !== "undefined"
    );

    dispatch(
      setAllItems({
        equipments: shippingItems,
        categories: data.categories,
      })
    );

    const payload = shippingItems.map((item: any, index) => ({
      shipping_item_id: item.shipping_item_id,
      shipping_item_position: index,
      _item_id: item._item_id || null,
    }));

    const res = await fetch(
      `/api/shipping/${shippingData?._shipping_id}/item/update`,
      {
        method: "POST",
        body: JSON.stringify({ items: payload }),
      }
    );
    await res.json();

    mutate(data);
  };

  return (
    <>
      <AddItemSetModal
        onOpenChange={setOpenItemSetModal}
        open={openItemSetModal}
      />
      <AddEquipmentModal
        open={addEquipmentOpenModal}
        onOpenChange={(open: any) => setAddEquipmentOpenModal(open)}
        shipping_id={router.query.shipping_id}
        excludedEquipments={data ? data.equipments : []}
        itemCategory={itemCategory}
        existingEquipmentOnly={existingEquipmentOnly}
        existingEquipments={existingEquipments}
      />
      <AddCategoryModal
        open={openAddCategoryModal}
        onOpenChange={(open: any) => {
          setOpenAddCategoryModal(open);
          if (!open) set_category_update(null);
        }}
        access_token={access_token}
        shipping_id={router.query.shipping_id}
        category_update={category_update}
      />
      <AddSerialNumberModal
        open={openSNModal}
        onOpenChange={(open: any) => {
          setOpenSnModal(open);
          if (!open) {
            setSelectedItemForAddSnModal(null);
          }
        }}
        _item_id={
          selectedItemForAddSnModal && selectedItemForAddSnModal._item_id
        }
        needed_quantity={
          selectedItemForAddSnModal
            ? !isNaN(selectedItemForAddSnModal.shipping_item_quantity)
              ? Number(selectedItemForAddSnModal.shipping_item_quantity)
              : 0
            : 0
        }
        _shipping_id={shippingData && shippingData._shipping_id}
        shipping_item_id={
          selectedItemForAddSnModal &&
          selectedItemForAddSnModal.shipping_item_id
        }
        addedSerialNumbers={addedSerialNumbers}
      />
      <AddCustomShippingItemModal
        onOpenChange={setOpenCustomAddShippingItemModal}
        open={openCustomAddShippingItemModal}
        _shipping_id={router.query.shipping_id}
      />
      <EditShippingItemModal
        item={editItem}
        _shipping_id={router.query.shipping_id}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditItem(false);
            setEditItem(null);
          }
        }}
        open={isEditItem}
      />
      {/* End Popover Modal */}

      <div className="w-3/4 flex flex-col">
        <div className="relative min-h-[calc(100vh-var(--header-height)-40px)]">
          <DetailsHeader />
          <TableHead />
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="list-container">
              {(provided: any) => (
                <div
                  className="flex flex-col py-2 gap-[5px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {!isLoading &&
                    Array.isArray(dataItems) &&
                    dataItems.length === 0 && (
                      <div className="flex justify-center">
                        <Image
                          src="/images/No data-rafiki.svg"
                          width={300}
                          height={300}
                          alt="No Data to Shown"
                        />
                      </div>
                    )}

                  {isLoading &&
                    [1, 2, 3].map((item, key) => (
                      <div
                        key={key}
                        className="py-2 flex items-start gap-2 bg-background rounded-app px-2"
                      >
                        <Skeleton className="h-[60px] w-[60px]" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-[300px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}

                  {Array.isArray(dataItems) &&
                    dataItems.map((item: any, key: number) => {
                      const draggableId = uniqid();

                      return (
                        <React.Fragment key={key}>
                          {typeof item.shipping_category_name !==
                            "undefined" && (
                            <CategoryItem
                              item={item}
                              onAddExistingItem={() => onAddExistingItem(item)}
                              onAddNewItem={() => onAddNewItem(item)}
                              openByDefault={true}
                              onClickAddSN={(_item: any, serial_numbers: any) =>
                                onClickAddSN(_item, serial_numbers)
                              }
                              onRename={() => {
                                setOpenAddCategoryModal(true);
                                set_category_update(item);
                              }}
                            >
                              {item.equipments &&
                                item.equipments.map((item: any, key: number) =>
                                  !item.item_set_id ? (
                                    <ItemList
                                      key={key}
                                      item={item}
                                      descriptionWidth={334}
                                      onClickAddSN={(serial_number: any) =>
                                        onClickAddSN(item, serial_number)
                                      }
                                    />
                                  ) : (
                                    <SetItem
                                      key={key}
                                      item={item}
                                      descriptionWidth={334}
                                      onOpenModal={(open: boolean) =>
                                        setOpenSnModal(open)
                                      }
                                    />
                                  )
                                )}
                            </CategoryItem>
                          )}
                          {typeof item.shipping_category_name ==
                            "undefined" && (
                            <Draggable
                              key={item.shipping_item_id}
                              draggableId={`item-${item.shipping_item_id}`}
                              index={key}
                            >
                              {(provided: any) =>
                                !item.item_set_id ? (
                                  <ItemList
                                    item={item}
                                    onClickAddSN={(serial_numbers: any) =>
                                      onClickAddSN(item, serial_numbers)
                                    }
                                    key={`item-${item.shipping_item_id}`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  />
                                ) : (
                                  <SetItem
                                    descriptionWidth={334}
                                    onOpenModal={(open: boolean) =>
                                      setOpenSnModal(open)
                                    }
                                    item={item}
                                    ref={provided.innerRef}
                                    key={`item-${item.shipping_item_id}`}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  />
                                )
                              }
                            </Draggable>
                          )}
                        </React.Fragment>
                      );
                    })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {!isLoading && (
          <div className="flex justify-center gap-2 items-center mt-auto sticky bottom-0 p-2">
            {shipping_status === ACTIVE && (
              <>
                <QrCodeScanner
                  onClickEditItem={(shipping_item_id) => {
                    if (data && data.equipments) {
                      const equipments: any = data.equipments;
                      const item = equipments.find(
                        (item: any) => item.shipping_item_id == shipping_item_id
                      );
                      if (item) {
                        setEditItem(item);
                        setIsEditItem(true);
                      }
                    }
                  }}
                />
                <AddButtonPopover
                  onClickAddCategoryButton={() => setOpenAddCategoryModal(true)}
                  onClickAddCustomEquipment={() =>
                    setOpenCustomAddShippingItemModal(true)
                  }
                  onClickAddEquipmentButton={onClickAddEquipment}
                  onClickAddSetButton={() => setOpenItemSetModal(true)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(ShippingItemContent);
