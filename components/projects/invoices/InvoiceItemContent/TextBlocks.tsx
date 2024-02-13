import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { GripVertical, Trash, Move } from "lucide-react";
import EditableTextareaCell from "./table/EditableTextAreaCell";
import { cn } from "@/lib/utils";
import { useDeleteTextBlock } from "./useDeleteTextBlock";

const iconProps = (colorClassName?: any) => ({
  className: cn("mr-2 h-[18px] w-[18px]", colorClassName),
  strokeWidth: 1.5,
});

export default function TextBlocks({
  invoice_id,
  list,
  editable,
}: {
  invoice_id: any;
  list: any[];
  editable: boolean;
}) {
  const { data: session }: any = useSession();
  const [items, setItems] = useState<any[]>([]);
  const { mutateDelete, Dialog: DeleteDialog } = useDeleteTextBlock({
    invoice_id,
    onDelete: (itb_id: string) => {
      console.log(itb_id);
      // const updatedList = items.filter(
      //   (item) => item.invoice_item_id !== invoice_item_id
      // );
      // setItems(updatedList);
    },
  });

  const Actions = ({ row }: any) => {
    return (
      <MoreOption>
        <ItemMenu
          onClick={() => {
            mutateDelete(row.original.itb_id);
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
    columnHelper.accessor("invoice_item_number", {
      header: "",
      meta: {
        width: "9%",
        colspan: 1,
        editable,
      },
    }),
    columnHelper.accessor("itb_text", {
      header: "Offer Text",
      cell: EditableTextareaCell,
      meta: {
        width: "49%",
        colspan: 3,
        id: "itb_id",
        editable,
      },
    }),
    columnHelper.accessor("invoice_item_line_total", {
      header: "",
      meta: {
        width: "31%",
        colspan: 3,
        editable,
      },
    }),
    columnHelper.accessor("itb_extra_text", {
      header: "Offer Extra Text",
      cell: EditableTextareaCell,
      meta: {
        width: "49%",
        id: "itb_id",
        editable,
      },
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (itbId: number, columnId: number, value: any) => {
        const response = await fetch(
          `${baseUrl}/api/projects/invoices/text_blocks/update/${itbId}`,
          {
            headers: authHeaders(session?.user?.access_token),
            method: "POST",
            body: JSON.stringify({ data: { [columnId]: value } }),
          }
        );
        const result = await response.json();
        const index = items.findIndex(
          (item) => item.itb_id === result.item.itb_id
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

  const updatePosition = async (list: any[]) => {
    const text_blocks = list.map((list) => list.itb_id);
    const response = await fetch(
      `${baseUrl}/api/projects/invoices/text_blocks/update_positions/${invoice_id}`,
      {
        headers: authHeaders(session?.user?.access_token),
        method: "POST",
        body: JSON.stringify({ text_blocks }),
      }
    );

    const result = await response.json();
    console.log({ result });
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
    setItems(list);
  }, [list]);

  if (!(Array.isArray(items) && items.length !== 0)) {
    return null;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="text-block-list-container">
          {(provided: any) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {table.getRowModel().rows.map((row, index) => {
                const columns = row._getAllCellsByColumnId();
                return (
                  <Draggable
                    key={row.original.itb_id}
                    draggableId={row.original.itb_id}
                    index={index}
                  >
                    {(provided: any) => (
                      <>
                        <tr
                          key={row.original.itb_id + "-text"}
                          className="w-full bg-white rounded-sm px-4 py-1"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <td className="py-3 px-2 w-[2%] border-b border-b-stone-100 group-last:border-0 align-center">
                            {editable ? (
                              <div {...provided.dragHandleProps}>
                                <Move />
                              </div>
                            ) : null}
                          </td>
                          <td className="w-[9%]"></td>
                          <td
                            width="49%"
                            colSpan={3}
                            className="py-3 px-2 border-b border-b-stone-100 group-last:border-0 align-top"
                          >
                            {flexRender(
                              columns["itb_text"].column.columnDef.cell,
                              columns["itb_text"].getContext()
                            )}
                          </td>
                          <td className="w-[10%]"></td>
                          <td className="w-[10%]"></td>
                          <td className="w-[11%]"></td>
                          <td
                            width="7%"
                            className="py-3 px-2 border-b border-b-stone-100 group-last:border-0 align-top"
                          >
                            {editable ? <Actions row={row} /> : null}
                          </td>
                        </tr>
                        <tr
                          key={row.original.itb_id + "-extra-text"}
                          className="w-full bg-white rounded-sm px-4 py-1"
                        >
                          <td className="py-3 px-2 w-[2%] border-b border-b-stone-100 group-last:border-0 align-top"></td>
                          <td className="w-[9%]"></td>
                          <td
                            width="49%"
                            colSpan={3}
                            className="py-3 px-2 border-b border-b-stone-100 group-last:border-0 align-top"
                          >
                            {flexRender(
                              columns["itb_extra_text"].column.columnDef.cell,
                              columns["itb_extra_text"].getContext()
                            )}
                          </td>
                          <td className="w-[10%]"></td>
                          <td className="w-[10%]"></td>
                          <td className="w-[11%]"></td>
                          <td className="w-[7%]"></td>
                        </tr>
                      </>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
      <DeleteDialog />
    </>
  );
}
