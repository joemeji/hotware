import MoreOption from "@/components/MoreOption";
import { LoadingListDetailsContext, TD } from "@/pages/projects/loading-list";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { ItemMenu, tableListMenu } from "..";
import { DeleteLoadingListItemModal } from "../modals/DeleteLoadingListModal";
import { EditLoadingItemModal } from "../modals/EditLoadingListItemModal";
import useSWR, { mutate } from "swr";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { ChevronDown, Menu, MenuIcon, Plus } from "lucide-react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddPopOverMenu } from "@/components/projects/shipping-list/ShippingDetails/AddButtonPopover";
import AddEquipmentModal from "../modals/AddEquipmentModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import VatSelect from "@/components/app/vat-select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import StatusChip from "../FormElements/StatusChip";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};
const EditableInputCellCategory = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = () => {
    table.options.meta?.updateData(
      row.original.loading_category_id,
      column.id,
      value
    );
    setEditable(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      // Enter
      submit();
    } else if (e.keyCode === 27) {
      // Esc
      setValue(initialValue);
      setEditable(false);
    }
  };

  if (editable) {
    return (
      <input
        className="w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        autoFocus={true}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return <div onClick={() => setEditable(true)}>{value}</div>;
};

const EditableInputCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = () => {
    table.options.meta?.updateData(
      row.original.loading_item_id,
      column.id,
      value
    );
    setEditable(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      // Enter
      submit();
    } else if (e.keyCode === 27) {
      // Esc
      setValue(initialValue);
      setEditable(false);
    }
  };

  if (editable) {
    return (
      <input
        className="w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        autoFocus={true}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return <div onClick={() => setEditable(true)}>{value}</div>;
};

export const LoadingListItem = (props: LoadingListItemProps) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange } = props;
  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [loadingItem, setLoadingItem] = useState(null);
  const [isLoadingItem, setLoadingIsItem] = useState(true);
  const [_open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState([]);
  const [openAddNewItemToCategory, setOpenAddNewItemToCategory] =
    useState(false);
  const [loadingID, setLoadingID] = useState(null);
  const [loadingCategoryID, setLoadingCategoryID] = useState(null);
  const [itemCategory, setItemCategory] = useState(null);
  const [existingEquipmentOnly, setExistingEquipmentOnly] = useState(false);
  const [existingEquipments, setExistingEquipments] = useState(null);
  const loadingDetails: any = useContext(LoadingListDetailsContext);
  const { data, isLoading, error } = useSWR(
    "/api/loading-list/" + loadingDetails?.loading_id + "/loading-items/lists",
    fetcher,
    swrOptions
  );
  const [items, setItems] = useState<any[]>(data && data.equipments);
  const [categories, setCategories] = useState<any[]>(data && data.categories);

  const handleItemMenu = (type: any, loadingItemId: any, isItem: any) => {
    if (type == "add-item") {
      setAddItemModal(true);
      setLoadingItem(loadingItemId);
    } else if (type == "edit") {
      setEditItemModal(true);
      setLoadingItem(loadingItemId);
    } else if (type == "delete") {
      setDeleteItemModal(true);
      setLoadingItem(loadingItemId);
    }

    setLoadingIsItem(isItem);
  };

  const onToggleCategoryEquipments = (categoryId: any) => {
    setOpenCategories((prevOpenCategories: any) => {
      const isOpen = prevOpenCategories.includes(categoryId);
      return isOpen
        ? prevOpenCategories.filter((id: any) => id !== categoryId)
        : [...prevOpenCategories, categoryId];
    });
  };

  const handleAddNewItemToCategory = (category: any) => {
    const payload: any = {
      loading_category_id: category.loading_category_id,
      loading_category_name: category.loading_category_name,
      loading_category_position: category.loading_category_position,
      loading_id: category.loading_id,
    };
    setLoadingID(category.loading_id);
    setOpenAddNewItemToCategory(true);
    setItemCategory(payload);
    setLoadingCategoryID(category.loading_category_id);
  };

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;

    if (droppedItem.type === "items") {
      const updatedList = [...data.equipments];
      // Remove dragged item
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      // Add dropped item
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
      // Update State
      setItems(updatedList);
      updatePositionItem(updatedList);
    } else {
      const updatedList = [...data.categories];
      // Remove dragged item
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      // Add dropped item
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
      // Update State
      setCategories(updatedList);
      updatePositionCategory(updatedList);
    }
  };

  const updatePositionItem = async (list: any[]) => {
    const items = list.map((list) => list.loading_item_id);
    const response = await fetch(
      `${baseUrl}/api/loading-list/loading-list-item/update_item_position/${loadingDetails?.loading_id}`,
      {
        headers: authHeaders(session?.user?.access_token),
        method: "POST",
        body: JSON.stringify({ items }),
      }
    );

    const result = await response.json();
    if (result && result.success) {
      toast({
        title: "Successfully Updated",
        variant: "success",
        duration: 4000,
      });
      mutate(
        `/api/loading-list/${loadingDetails?.loading_id}/loading-items/lists`
      );
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
      }, 300);
    }
  };

  const updatePositionCategory = async (list: any[]) => {
    const items = list.map((list) => list.loading_category_id);
    const response = await fetch(
      `${baseUrl}/api/loading-list/loading-list-item/update_category_position/${loadingDetails?.loading_id}`,
      {
        headers: authHeaders(session?.user?.access_token),
        method: "POST",
        body: JSON.stringify({ items }),
      }
    );

    const result = await response.json();
    if (result && result.success) {
      mutate(
        `/api/loading-list/${loadingDetails?.loading_id}/loading-items/lists`
      );
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
      }, 300);
    }
  };

  const columnHelper = createColumnHelper<any>();
  const itemColumns = [
    columnHelper.accessor("loading_item_name", {
      header: "Unit",
      cell: EditableInputCell,
      meta: {
        width: "31%",
      },
    }),
    columnHelper.accessor("loading_item_quantity", {
      header: "Pieces",
      cell: EditableInputCell,
      meta: {
        width: "8%",
      },
    }),
    columnHelper.accessor("loading_item_lm", {
      header: "L / M",
      cell: EditableInputCell,
      meta: {
        width: "10%",
      },
    }),
    columnHelper.accessor("loading_item_weight", {
      header: "Weight",
      cell: EditableInputCell,
      meta: {
        width: "10%",
      },
    }),
  ];

  const categoryColumns = [
    columnHelper.accessor("loading_category_name", {
      header: "unit",
      cell: EditableInputCellCategory,
      meta: {
        width: "31%",
      },
    }),
  ];

  const categoryTable = useReactTable({
    data: data && data.categories,
    columns: categoryColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (
        loadingCategoryId: number,
        columnId: number,
        value: any
      ) => {
        const response = await fetch(
          `${baseUrl}/api/loading-list/loading-list-item/update_category/${loadingCategoryId}`,
          {
            headers: authHeaders(session?.user?.access_token),
            method: "POST",
            body: JSON.stringify({ data: { [columnId]: value } }),
          }
        );

        const result = await response.json();
        const index = data.categories.findIndex(
          (item: any) =>
            item.loading_cateogry_id === result.item.loading_cateogry_id
        );

        if (index !== -1) {
          const updateList = [...data.categories];
          updateList[index] = result.item;
          setCategories(updateList);
        }
        mutate(
          `/api/loading-list/${loadingDetails?.loading_id}/loading-items/lists`
        );
        toast({
          title: "Successfully Updated",
          variant: "success",
          duration: 4000,
        });
      },
    },
    debugTable: true,
  });

  const table = useReactTable({
    data: data && data.equipments,
    columns: itemColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (
        loadingItemId: number,
        columnId: number,
        value: any
      ) => {
        const response = await fetch(
          `${baseUrl}/api/loading-list/loading-list-item/update_item/${loadingItemId}`,
          {
            headers: authHeaders(session?.user?.access_token),
            method: "POST",
            body: JSON.stringify({ data: { [columnId]: value } }),
          }
        );

        const result = await response.json();
        const index = data.equipments.findIndex(
          (item: any) => item.loading_item_id === result.item.loading_item_id
        );

        if (index !== -1) {
          const updateList = [...data.equipments];
          updateList[index] = result.item;
          setItems(updateList);
        }
        mutate(
          `/api/loading-list/${loadingDetails?.loading_id}/loading-items/lists`
        );
        toast({
          title: "Successfully Updated",
          variant: "success",
          duration: 4000,
        });
      },
    },
    debugTable: true,
  });

  function CategoryItemContent(item: any) {
    return (
      <tr>
        <td colSpan={8} className="p-1">
          {item &&
            item.items.map((item: any, key: number) => (
              <div
                key={key}
                className={cn(
                  "overflow-hidden flex flex-col bg-white rounded-sm hover:bg-stone-50"
                )}
              >
                <ScrollArea
                  className="border-l border-1 w-full rounded-app"
                  style={{
                    height: openCategories.includes(
                      item.loading_category_id as never
                    )
                      ? "50%"
                      : 0,
                    backgroundColor: "#e7e5e4",
                  }}
                >
                  <div
                    className={cn(
                      "flex relative p-2",
                      item.open && "border-b border-stone-100"
                    )}
                  >
                    <div className="w-[8%]">
                      <Image
                        alt={item.loading_item_name || "equipment"}
                        width={60}
                        height={60}
                        className="w-[50px] h-[50px] object-cover rounded-sm"
                        src={
                          baseUrl + "/equipments/thumbnail/" + item.item_image
                        }
                        onError={(e: any) => {
                          e.target.srcset = `${baseUrl}/equipments/thumbnail/Coming_Soon.jpg`;
                        }}
                      />
                    </div>
                    <div className="flex items-center w-[45%]">
                      <div className="flex flex-col px-2">
                        <span className="text-stone-500">
                          {item.loading_item_name}
                        </span>
                      </div>
                    </div>
                    <div className="w-[8%] p-2">
                      <span className="text-sm">
                        {item.loading_item_quantity}
                      </span>
                    </div>
                    <div className="w-[8%] p-2 ">
                      <span className="text-sm">{item.loading_item_lm}</span>
                    </div>
                    <div className="w-[11%] p-2 ">
                      <span className="text-sm">
                        {item.loading_item_weight}
                      </span>
                    </div>
                    <div className="w-[11%] p-2 ">
                      <span className="text-sm">
                        {item.loading_item_weight * item.loading_item_quantity}
                      </span>
                    </div>
                    <div className="w-[15%] p-2 ">
                      {item.loading_item_is_set == 1 ? (
                        <StatusChip status="is_set" />
                      ) : (
                        <StatusChip status="equipment" />
                      )}
                    </div>
                    <div className="w-[5%] p-2 ">
                      <MoreOption>
                        {[...tableListMenu].map((option: any, key: number) =>
                          option.actionType !== "add-item" ? (
                            <ItemMenu
                              key={key}
                              data-menu={option.actionType}
                              onClick={() =>
                                handleItemMenu(
                                  option.actionType,
                                  item.loading_item_id,
                                  true
                                )
                              }
                            >
                              {option.icon}
                              <span
                                className="font-medium"
                                data-menu={option.actionType}
                              >
                                {option.name}
                              </span>
                            </ItemMenu>
                          ) : null
                        )}
                      </MoreOption>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            ))}
        </td>
      </tr>
    );
  }

  return (
    <>
      <DeleteLoadingListItemModal
        open={deleteItemModal}
        loadingID={loadingDetails?.loading_id}
        id={loadingItem}
        isItem={isLoadingItem}
        onOpenChange={(open: any) => setDeleteItemModal(open)}
      />
      <AddEquipmentModal
        open={openAddNewItemToCategory}
        onOpenChange={(open: any) => setOpenAddNewItemToCategory(open)}
        loading_id={loadingID}
        excludedEquipments={data ? data.equipments : []}
        itemCategory={itemCategory}
        existingEquipmentOnly={existingEquipmentOnly}
        existingEquipments={existingEquipments}
        loading_category_id={loadingCategoryID}
      />
      <EditLoadingItemModal
        open={editItemModal}
        onOpenChange={(open: any) => setEditItemModal(open)}
      />
      <table className=" border-spacing-y-[5px] category-container">
        <thead className="sticky top-0 z-[10] backdrop-blur-md">
          <tr>
            <th className="w-[9%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium"></th>
            <th className="w-[40%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              Unit
            </th>
            <th className="w-[5%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              Pieces
            </th>
            <th className="w-[10%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              L / M
            </th>
            <th className="w-[10%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              Weight Per Piece(kg)
            </th>
            <th className="w-[10%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              Total Weight(kg)
            </th>
            <th className="w-[15%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium">
              Type
            </th>
            <th className="w-[5%] py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium" />
          </tr>
        </thead>

        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="category-container" type="category">
            {(provided: any) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {data &&
                  data.equipments &&
                  categoryTable
                    .getRowModel()
                    .rows.map((category: any, index: number) => (
                      <Draggable
                        key={category.original.loading_category_id}
                        draggableId={category.original.loading_category_id}
                        index={index}
                      >
                        {(provided: any) => (
                          <>
                            <tr
                              key={category.original.loading_category_id}
                              className="w-full bg-white rounded-sm px-4 py-4 hover:bg-stone-50"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="px-2">
                                <Menu className="w-full bg-white rounded-sm px-4 py-1" />
                              </td>
                              {category
                                .getVisibleCells()
                                .map((cell: any, index: number) => {
                                  return (
                                    <td
                                      key={cell.id}
                                      width={
                                        (cell.column.columnDef?.meta as any)
                                          ?.width || "10%"
                                      }
                                      className="px-2 border-b border-b-stone-100 group-last:border-0 align-center"
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </td>
                                  );
                                })}
                              <td className="px-2"></td>
                              <td className="px-2"></td>
                              <td className="px-2"></td>
                              <td className="px-2"></td>
                              <td className="px-2"></td>
                              <td className="text-center w-[10%] px-2 py-2 flex">
                                {category.original.items &&
                                  category.original.items.length > 0 && (
                                    <button
                                      className="hover:bg-stone-100 p-1 rounded-sm"
                                      onClick={() =>
                                        onToggleCategoryEquipments(
                                          category.original.loading_category_id
                                        )
                                      }
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "h-5 w-5 transition-all duration-500",
                                          _open && "-rotate-180"
                                        )}
                                        strokeWidth={1}
                                      />
                                    </button>
                                  )}
                                <Popover>
                                  <PopoverTrigger className="hover:bg-stone-100 p-1 rounded-sm">
                                    <Plus
                                      className={cn(
                                        "h-5 w-5 transition-all duration-300"
                                      )}
                                      strokeWidth={1}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="py-2 px-0 w-auto focus:border-none"
                                    style={{ border: "none" }}
                                  >
                                    <div className="flex flex-col focus:border-none">
                                      <AddPopOverMenu
                                        title="Add Item"
                                        iconColor="text-purple-500"
                                        iconBg="bg-purple-500/10"
                                        onClick={() =>
                                          handleAddNewItemToCategory(
                                            category.original
                                          )
                                        }
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </td>
                            </tr>
                            <CategoryItemContent {...category.original} />
                          </>
                        )}
                      </Draggable>
                    ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
          <Droppable droppableId="item-container" type="items">
            {(provided: any) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {data &&
                  data.equipments &&
                  table.getRowModel().rows.map((item: any, index: number) => (
                    <Draggable
                      key={item.original.loading_item_id}
                      draggableId={item.original.loading_item_id}
                      index={index}
                    >
                      {(provided: any) => (
                        <tr
                          key={item.original.loading_item_id}
                          className="w-full bg-white rounded-sm px-4 py-1 hover:bg-stone-50"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <td className="px-2 py-1 flex items-center max-w-[250px]">
                            <Image
                              src={
                                baseUrl +
                                "/equipments/thumbnail/" +
                                item.original.item_image
                              }
                              width={60}
                              height={60}
                              className="w-[50px] h-[50px] object-cover rounded-sm mr-[10px]"
                              alt={
                                item.original.loading_item_name || "equipment"
                              }
                            />
                          </td>
                          {item
                            .getVisibleCells()
                            .map((cell: any, index: number) => {
                              return (
                                <td
                                  key={cell.id}
                                  width={
                                    (cell.column.columnDef?.meta as any)
                                      ?.width || "10%"
                                  }
                                  className="py-3 px-2 border-b border-b-stone-100 group-last:border-0 align-center"
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              );
                            })}
                          <td className="py-3 px-2 text-center max-w-[100px]">
                            {Number(
                              item.original.loading_item_total_weight
                            ).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-center max-w-[120px]">
                            {item.original.loading_item_is_set == 1 ? (
                              <StatusChip status="is_set" />
                            ) : (
                              <StatusChip status="equipment" />
                            )}
                          </td>
                          <td className="text-center py-3 px-2">
                            <MoreOption>
                              {[...tableListMenu].map(
                                (option: any, key: number) =>
                                  option.actionType !== "add-item" ? (
                                    <ItemMenu
                                      key={key}
                                      data-menu={option.actionType}
                                      onClick={() =>
                                        handleItemMenu(
                                          option.actionType,
                                          item.original.loading_item_id,
                                          true
                                        )
                                      }
                                    >
                                      {option.icon}
                                      <span
                                        className="font-medium"
                                        data-menu={option.actionType}
                                      >
                                        {option.name}
                                      </span>
                                    </ItemMenu>
                                  ) : null
                              )}
                            </MoreOption>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
    </>
  );
};

type LoadingListItemProps = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};
