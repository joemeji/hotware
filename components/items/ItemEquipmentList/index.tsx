import { BreakPointContext } from "@/context/layout-context";
import { cn } from "@/lib/utils";
import { truncate } from "@/utils/text";
import Link from "next/link";
import React, { memo, useContext } from "react";
import Highlighter from "react-highlight-words";
import { ItemMenu, TD, actionMenu, certificationActionButton } from "..";
import MoreOption from "@/components/MoreOption";
import { baseUrl } from "@/utils/api.config";
import Image from "next/image";

type TypeItemEquipmentList = {
  item_name: any; 
  item_number: any; 
  item_sub_category_name: any; 
  _item_id: any; 
  item_image: any; 
  item_sub_category_index: any;
  with_serial: any;
  total_serial_numbers: any;
  children: React.ReactNode;
  onClickAction?: (actionType: string) => void,
  onClickSerialButton?: (_item_id: string) => void
  _highlightResult?: any
  item_category_name?: string
  current_quantity?: any
  article_number?: any
}

const ItemEquipmentList = React.forwardRef((props: TypeItemEquipmentList, ref: any) => {
  const { 
    item_name, 
    item_number, 
    item_sub_category_name, 
    _item_id, 
    item_image, 
    item_sub_category_index,
    with_serial,
    total_serial_numbers,
    children,
    onClickAction,
    onClickSerialButton,
    _highlightResult,
    item_category_name,
    current_quantity,
    article_number
  } = props;
  const bp = useContext(BreakPointContext);

  return (
    <>
      <TD>
        <div className="flex items-start gap-3 group">
          <div className="relative">
            <div className="absolute top-[3px] left-[4px]">
              {children}
            </div>
              <Image
                width={200}
                height={200}
                src={`${baseUrl}/equipments/thumbnail/${item_image}`}
                className="h-[90px] w-[90px] object-cover text-xs rounded-md"
                alt={item_name}
              />
          </div>
          <div className="flex flex-col h-[90px]">
            <Link className="flex flex-col" href={`/items/equipment/${_item_id}/details`}>
              <span className="mb-1 font-medium group-hover:underline" title={item_name}>
                <Highlighter 
                  searchWords={_highlightResult ? _highlightResult.item_name.matchedWords : []}
                  autoEscape={true}
                  textToHighlight={truncate(item_name, 50)}
                />
              </span>
              <span className="text-stone-400 group-hover:underline">
                <Highlighter 
                  searchWords={_highlightResult ? _highlightResult.article_number.matchedWords : []}
                  autoEscape={true}
                  textToHighlight={article_number}
                />
              </span>
            </Link>
            {(with_serial && current_quantity > 0) && (
              <button 
                type="button"
                className={cn(
                  'mt-auto w-fit pe-3 ps-0 text-sm',
                  'text-stone-900 font-medium',
                  'hover:bg-stone-200',
                  'flex items-center group/serial',
                  'rounded-xl border-2',
                )}
                onClick={() => onClickSerialButton && onClickSerialButton(_item_id)}
              >
                  <span className="text-sm font-bold rounded-full py-1 px-2 flex items-center justify-center">
                    {current_quantity}
                  </span>
                <span 
                  className="py-[3px] group-hover/serial:border-stone-300 text-stone-500"
                >
                  SN
                </span>
              </button>
            )}
          </div>
        </div>
      </TD>
      <TD className="align-top">
      <div className="sub-categories">
        <span className="text-stone-500">
          <Highlighter 
            searchWords={_highlightResult ? _highlightResult.item_category_name.matchedWords : []}
            autoEscape={true}
            textToHighlight={item_category_name || ''}
          />
        </span>
      </div>
    </TD>
      <TD className="align-top">
        <div className="sub-categories">
          <span className="text-stone-500">
            <Highlighter 
              searchWords={_highlightResult ? _highlightResult.item_sub_category_name.matchedWords : []}
              autoEscape={true}
              textToHighlight={item_sub_category_name}
            />
          </span>
        </div>
      </TD>
      <TD className="text-right pe-4 align-top">
        <MoreOption>
          {[...actionMenu, ...certificationActionButton].map((action, key) => (
              <ItemMenu key={key} onClick={() => onClickAction && onClickAction(action.actionType)}>
                {action.icon}
                <span className="text-stone-600 font-medium">{action.name}</span>
              </ItemMenu>
            ))}
        </MoreOption>
      </TD>
    </>
  );
});
ItemEquipmentList.displayName = 'ItemEquipmentList';

export default memo(ItemEquipmentList);