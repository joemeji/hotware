import useSWR from "swr";
import dynamic from "next/dynamic";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AddButtonPopover from "@/components/projects/offers/OfferDetails/AddButtonPopover";
import { Skeleton } from "@/components/ui/skeleton";
import DetailsHeader from "../OfferDetails/DetailsHeader";
import { useSession } from "next-auth/react";
import VatSelect from "@/components/app/vat-select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Trash, CalculatorIcon } from "lucide-react";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { useDeleteItem } from "./useDeleteItem";
import TextBlocks from "./TextBlocks";
import EditableTextareaCell from "./table/EditableTextareaCell";

// modals
const AddEquipmentModal = dynamic(
  () => import("@/components/projects/offers/modals/AddEquipmentModal")
);
const AddCustomEquipmentModal = dynamic(
  () => import("@/components/projects/offers/modals/AddCustomOfferItemModal")
);
const OfferCalculationModal = dynamic(
  () => import("@/components/projects/offers/modals/OfferCalculationModal")
);
const EditOfferItemModal = dynamic(
  () => import("@/components/projects/offers/modals/EditOfferItemModal")
);
const AddReceiptTotalModal = dynamic(
  () => import("@/components/projects/offers/modals/AddReceiptTotalModal")
);
const AddTextBlockModal = dynamic(
  () => import("@/components/projects/offers/modals/AddTextBlockModal")
);
const AdditionalHeaderTextModal = dynamic(
  () => import("@/components/projects/offers/modals/AdditionalHeaderTextModal")
);

const iconProps = (colorClassName?: any) => ({
  className: cn("mr-2 h-[18px] w-[18px]", colorClassName),
  strokeWidth: 1.5,
});

interface Vat {
  // Define the structure of each object in the array
  id: number;
  description: string;
  amount: number;
  // Add other properties as needed
}

const EditableInputCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = () => {
    table.options.meta?.updateData(
      row.original.offer_item_id,
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

const EditableVatCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (newValue: any) => {
    table.options.meta?.updateData(
      row.original.offer_item_id,
      column.id,
      newValue
    );
    setValue(newValue);
    setEditable(false);
  };

  return <VatSelect onChangeValue={onChange} value={value} />;
};

function OfferItemContent({ offer_id, currency, _data }: any) {
  const isExclusiveVat = _data ? _data.offer_is_exclusive_vat : 0;
  const { data: session }: any = useSession();
  const router = useRouter();
  const [addEquipmentOpenModal, setAddEquipmentOpenModal] = useState(false);
  const [itemCategory, setItemCategory] = useState(null);
  const [existingEquipmentOnly, setExistingEquipmentOnly] = useState(false);
  const [existingEquipments, setExistingEquipments] = useState(null);
  const [openCustomAddItemModal, setOpenCustomAddItemModal] = useState(false);
  const [openAdditionalHeaderTextModal, setOpenAdditionalHeaderTextModal] =
    useState(false);
  const [openReceiptTotalModal, setOpenReceiptTotalModal] = useState(false);
  const [openTextBlockModal, setOpenTextBlockModal] = useState(false);
  const [openCalculationModal, setOpenCalculationModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState<any[]>([]);
  const { mutateDelete, Dialog: DeleteDialog } = useDeleteItem({
    offer_id,
    onDelete: (offer_item_id: string) => {
      const updatedList = items.filter(
        (item) => item.offer_item_id !== offer_item_id
      );
      setItems(updatedList);
    },
  });

  if (!openReceiptTotalModal) {
  }

  const Actions = ({ row }: any) => {
    return (
      <MoreOption>
        <ItemMenu
          onClick={() => {
            setSelectedItem(row.original.offer_item_id);
            setOpenCalculationModal(true);
          }}
        >
          <CalculatorIcon {...iconProps()} />
          <span className="font-medium">Offer Calculation</span>
        </ItemMenu>
        <ItemMenu
          onClick={() => {
            setSelectedItem(row.original);
            setOpenEditItemModal(true);
          }}
        >
          <Pencil {...iconProps()} />
          <span className="font-medium">Edit</span>
        </ItemMenu>
        <ItemMenu
          onClick={() => {
            mutateDelete(row.original.offer_item_id);
          }}
        >
          <Trash {...iconProps()} />
          <span className="font-medium">Delete</span>
        </ItemMenu>
      </MoreOption>
    );
  };

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("offer_item_number", {
      header: "Article No.",
      cell: EditableInputCell,
      meta: {
        width: "9%",
      },
    }),
    columnHelper.accessor("offer_item_name", {
      header: "Description",
      cell: EditableTextareaCell,
      meta: {
        width: "31%",
        id: "offer_item_id",
      },
    }),
    columnHelper.accessor("offer_item_quantity", {
      header: "Quantity",
      cell: EditableInputCell,
      meta: {
        width: "8%",
      },
    }),
    columnHelper.accessor("offer_item_price", {
      header: "Unit Price",
      cell: EditableInputCell,
      meta: {
        width: "10%",
      },
    }),
    columnHelper.accessor("offer_item_vat", {
      header: "VAT",
      cell: EditableVatCell,
      meta: {
        width: "10%",
      },
    }),
    columnHelper.accessor("offer_item_discount", {
      header: "Discount",
      cell: EditableInputCell,
      meta: {
        width: "10%",
      },
    }),
    columnHelper.accessor("offer_item_line_total", {
      header: "Total Price",
      cell: ({ getValue }) => (+getValue()).toLocaleString(),
      meta: {
        width: "11%",
      },
    }),
    columnHelper.accessor("", {
      header: "Actions",
      cell: Actions,
      meta: {
        width: "7%",
      },
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (offerItemId: number, columnId: number, value: any) => {
        const response = await fetch(
          `${baseUrl}/api/projects/offers/items/update/${offerItemId}`,
          {
            headers: authHeaders(session?.user?.access_token),
            method: "POST",
            body: JSON.stringify({ data: { [columnId]: value } }),
          }
        );

        const result = await response.json();
        const index = items.findIndex(
          (item) => item.offer_item_id === result.item.offer_item_id
        );

        if (index !== -1) {
          const updateList = [...items];
          updateList[index] = result.item;
          setItems(updateList);
        }
      },
    },
    debugTable: true,
  });

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [`/api/projects/offers/items/${offer_id}`, session?.user?.access_token]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { data: receiptTotals, isLoading: isLoadingReceiptTotals } = useSWR(
    session?.user?.access_token
      ? [
          `/api/projects/offers/receipt_totals/${offer_id}`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { data: textBlocks, isLoading: isLoadingTextBlocks } = useSWR(
    session?.user?.access_token
      ? [
          `/api/projects/offers/text_blocks/${offer_id}`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  let subtotal = useMemo(() => {
    return (
      items?.reduce(
        (prev: number, item: any) =>
          prev + parseFloat(item.offer_item_line_total),
        0
      ) || 0
    );
  }, [items]);

  const subtotalWithReceiptTotal = () => {
    const BASE_SUBTOTAL = subtotal;
    let vatTotal: number = 0;
    let vats: Vat[] = [];

    if (items && items.length > 0) {
      items.map((row: any, key: any) => {
        let vat =
          vats && vats.find((vatTemp) => vatTemp.id == row.offer_item_vat);
        let divisible =
          100 +
          (isExclusiveVat == 1 ? 0 : parseFloat(row.offer_item_vat_percentage));
        let percentage = parseFloat(row.offer_item_vat_percentage) / divisible;
        let amount = parseFloat(row.offer_item_line_total) * percentage;

        if (vat) {
          vat.amount = vat.amount + amount;
        } else if (row.offer_item_vat != 0) {
          vats = [
            ...vats,
            {
              id: row.offer_item_vat,
              description: row.vat_description,
              amount: amount,
            },
          ];
        }
      });
    }

    let chargeRows = receiptTotals?.map((receiptTotal: any) => {
      let amount =
        parseInt(receiptTotal.offerrt_type) == 2
          ? (receiptTotal.offerrt_value / 100) * BASE_SUBTOTAL
          : receiptTotal.offerrt_value;
      amount =
        parseInt(receiptTotal.offerrt_is_surcharge) == 1 ? amount : amount * -1;
      subtotal += parseFloat(amount);
      let vat =
        vats && vats.find((vatTemp) => vatTemp.id == receiptTotal.offerrt_vat);
      let divisible =
        100 +
        (isExclusiveVat == 1
          ? 0
          : parseFloat(receiptTotal.offerrt_vat_percentage));

      let percentage =
        parseFloat(receiptTotal.offerrt_vat_percentage) / divisible;
      let vatAmount = parseFloat(amount) * percentage;

      if (vat) {
        vat.amount = vat.amount + vatAmount;
      } else if (parseInt(receiptTotal.offerrt_vat) != 0) {
        vats = [
          ...vats,
          {
            id: receiptTotal.offerrt_vat,
            description: receiptTotal.vat_description,
            amount: vatAmount,
          },
        ];
      }

      return (
        <tr
          key={receiptTotal.someUniqueKey}
          className="w-full bg-white rounded-sm px-4 py-1"
        >
          <td className="w-[2%]"></td>
          <td className="w-[9%]"></td>
          <td className="w-[31%] py-3 px-2 font-bold">
            {receiptTotal.offerrt_text}
          </td>
          <td className="w-[8%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[10%]">
            {receiptTotal.offerrt_vat == 0 ? "No VAT" : receiptTotal.vat_code}
          </td>
          <td className="w-[10%]"></td>
          <td className="w-[11%] py-3 px-2 font-bold">
            {amount.toLocaleString()}
          </td>
          <td className="w-[7%]"></td>
        </tr>
      );
    });

    if (chargeRows && chargeRows.length > 0) {
      chargeRows.push(
        <tr key="subtotalRow" className="w-full bg-white rounded-sm px-4 py-1">
          <td className="w-[2%]"></td>
          <td className="w-[9%]"></td>
          <td className="w-[31%] py-3 px-2 font-bold">SUBTOTAL</td>
          <td className="w-[8%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[11%] py-3 px-2 font-bold">
            {subtotal.toLocaleString()}
          </td>
          <td className="w-[7%]"></td>
        </tr>
      );
    }

    if (receiptTotals && receiptTotals.length == 0) {
      chargeRows.push(
        <tr key="subtotalRow" className="w-full bg-white rounded-sm px-4 py-1">
          <td className="w-[2%]"></td>
          <td className="w-[9%]"></td>
          <td className="w-[31%] py-3 px-2 font-bold">SUBTOTAL</td>
          <td className="w-[8%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[10%]"></td>
          <td className="w-[11%] py-3 px-2 font-bold">
            {subtotal.toLocaleString()}
          </td>
          <td className="w-[7%]"></td>
        </tr>
      );
    }
    chargeRows = vats.reduce((prev, row) => {
      var vatAmount = row.amount.toFixed(2);
      vatTotal += parseFloat(vatAmount);

      if (row.amount !== 0) {
        prev.push(
          <tr key={row.id} className="w-full bg-white rounded-sm px-4 py-1">
            <td className="w-[2%]"></td>
            <td className="w-[9%]"></td>
            <td className="w-[31%] py-3 px-2 font-bold">{row.description}</td>
            <td className="w-[8%]"></td>
            <td className="w-[10%]"></td>
            <td className="w-[10%]"></td>
            <td className="w-[10%]"></td>
            <td className="w-[11%] py-3 px-2 font-bold">{vatAmount}</td>
            <td className="w-[7%]"></td>
          </tr>
        );
      }

      return prev;
    }, chargeRows || []);

    let total = isExclusiveVat == 1 ? subtotal + vatTotal : subtotal;
    chargeRows.push(
      <tr key="totalRow" className="w-full bg-white rounded-sm px-4 py-1">
        <td className="w-[2%]"></td>
        <td className="w-[9%]"></td>
        <td className="w-[31%] py-3 px-2 font-bold">TOTAL</td>
        <td className="w-[8%]"></td>
        <td className="w-[10%]"></td>
        <td className="w-[10%]"></td>
        <td className="w-[10%]"></td>
        <td className="w-[11%] py-3 px-2 font-bold">
          {total.toLocaleString()}
        </td>
        <td className="w-[7%]"></td>
      </tr>
    );
    return chargeRows;
  };

  const onClickAddEquipment = useCallback(() => {
    setAddEquipmentOpenModal(!addEquipmentOpenModal);
  }, [addEquipmentOpenModal]);

  const updatePosition = async (list: any[]) => {
    const items = list.map((list) => list.offer_item_id);
    const response = await fetch(
      `${baseUrl}/api/projects/offers/items/update_positions/${offer_id}`,
      {
        headers: authHeaders(session?.user?.access_token),
        method: "POST",
        body: JSON.stringify({ items }),
      }
    );

    const result = await response.json();
  };

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...items];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItems(updatedList);
    updatePosition(updatedList);
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems(data as any);
    }
  }, [data]);

  useEffect(() => {
    if (!addEquipmentOpenModal) {
      setItemCategory(null);
      setExistingEquipments(null);
      setTimeout(() => {
        setExistingEquipmentOnly(false);
      }, 300);
    }
  }, [addEquipmentOpenModal]);

  return (
    <>
      {/* Popover Modal */}
      <DeleteDialog />

      <AddEquipmentModal
        open={addEquipmentOpenModal}
        onOpenChange={(open: any) => setAddEquipmentOpenModal(open)}
        offer_id={router.query.offer_id}
        excludedEquipments={data ? data.equipments : []}
        itemCategory={itemCategory}
        existingEquipmentOnly={existingEquipmentOnly}
        existingEquipments={existingEquipments}
      />
      <AddCustomEquipmentModal
        onOpenChange={setOpenCustomAddItemModal}
        open={openCustomAddItemModal}
        _offer_id={router.query.offer_id}
      />
      <AdditionalHeaderTextModal
        onOpenChange={setOpenAdditionalHeaderTextModal}
        open={openAdditionalHeaderTextModal}
        _offer_id={router.query.offer_id}
      />
      <AddReceiptTotalModal
        onOpenChange={setOpenReceiptTotalModal}
        open={openReceiptTotalModal}
        _offer_id={router.query.offer_id}
      />
      <AddTextBlockModal
        onOpenChange={setOpenTextBlockModal}
        open={openTextBlockModal}
        _offer_id={router.query.offer_id}
      />
      <OfferCalculationModal
        onOpenChange={setOpenCalculationModal}
        open={openCalculationModal}
        offer_id={offer_id}
        offer_item_id={selectedItem}
        currency={currency || "$"}
      />
      <EditOfferItemModal
        offer={selectedItem}
        _offer_id={router.query.offer_id}
        onOpenChange={(open) => {
          if (!open) {
            setOpenEditItemModal(false);
            setSelectedItem(null);
          }
        }}
        open={openEditItemModal}
        onUpdated={(offer_item_id: any, newVal: any) => {
          const list = [...items];
          const index = list.findIndex(
            (item) => item.offer_item_id == offer_item_id
          );
          list[index].offer_item_name = newVal;
          setItems(list);
        }}
      />
      {/* End Popover Modal */}

      <div className="w-3/4 flex flex-col">
        <div className="relative min-h-[calc(100vh-var(--header-height)-40px)]">
          <DetailsHeader
            _offer_id={router.query.offer_id?.toString()}
            data={_data}
          />
          <table className="w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden">
            <thead>
              <tr>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[2%]"></th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[9%]">
                  Article No.
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[31%]">
                  Equipment
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[8%]">
                  Quantity
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[10%]">
                  Unit Price
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[10%]">
                  VAT
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[10%]">
                  Discount
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[11%]">
                  Total Price
                </th>
                <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[7%]">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
          <div className="flex flex-col py-1 gap-[5px]">
            {!isLoading && Array.isArray(data) && data.length === 0 && (
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

            <DragDropContext onDragEnd={handleDrop}>
              <Droppable droppableId="list-container">
                {(provided: any) => (
                  <table
                    className="mt-0 border-separate border-spacing-y-[5px] list-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <tbody>
                      {table.getRowModel().rows.map((row, index) => {
                        return (
                          <Draggable
                            key={row.original.offer_item_id}
                            draggableId={row.original.offer_item_id}
                            index={index}
                          >
                            {(provided: any) => (
                              <tr
                                key={row.original.offer_item_id}
                                className="w-full bg-white rounded-sm px-4 py-1"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <td className="py-3 px-2 w-[2%] border-b border-b-stone-100 group-last:border-0 align-top">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical />
                                  </div>
                                </td>
                                {row.getVisibleCells().map((cell, index) => {
                                  return (
                                    <td
                                      key={cell.id}
                                      width={
                                        (cell.column.columnDef?.meta as any)
                                          ?.width || "10%"
                                      }
                                      className="py-3 px-2 border-b border-b-stone-100 group-last:border-0 align-top"
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      {receiptTotals && receiptTotals.length > 0 ? (
                        <tr
                          key="subtotalRow"
                          className="w-full bg-white rounded-sm px-4 py-1"
                        >
                          <td className="w-[2%]"></td>
                          <td className="w-[9%]"></td>
                          <td className="w-[31%] py-3 px-2 font-bold">
                            SUBTOTAL
                          </td>
                          <td className="w-[8%]"></td>
                          <td className="w-[10%]"></td>
                          <td className="w-[10%]"></td>
                          <td className="w-[10%]"></td>
                          <td className="w-[11%] py-3 px-2 font-bold">
                            {subtotal.toLocaleString()}
                          </td>
                          <td className="w-[7%]"></td>
                        </tr>
                      ) : null}
                      {Array.isArray(data) && data.length !== 0
                        ? subtotalWithReceiptTotal()
                        : null}
                    </tbody>
                    {Array.isArray(data) && data.length !== 0 ? (
                      <TextBlocks
                        list={textBlocks}
                        offer_id={router.query.offer_id}
                      />
                    ) : null}
                  </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
        {!isLoading && (
          <div className="flex justify-center gap-2 items-center mt-auto sticky bottom-0 p-2">
            <AddButtonPopover
              onClickAddCustomEquipment={() => setOpenCustomAddItemModal(true)}
              onClickAddEquipmentButton={onClickAddEquipment}
              onClickAdditionalHeaderTextButton={() =>
                setOpenAdditionalHeaderTextModal(true)
              }
              onClickAddReceiptTotalButton={() => {
                setOpenReceiptTotalModal(true);
              }}
              onClickAddTextBlockButton={() => setOpenTextBlockModal(true)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default memo(OfferItemContent);
