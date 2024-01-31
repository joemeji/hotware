import { baseUrl, fetchApi } from "@/utils/api.config";
import { memo, useContext } from "react";
import { Checkbox } from "../ui/checkbox";
import useSWRInfinite from "swr/infinite";
import { ScrollArea } from "../ui/scroll-area";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Highlighter from "react-highlight-words";
import { ShippingCategory } from "../projects/shipping-list/modals/AddCategoryModal";
import { MoveRight } from "lucide-react";
import LoadingMore from "../LoadingMore";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { useSession } from "next-auth/react";

function ItemSelect(props: ItemSelectProps) {
  const { data: session }: any = useSession();
  const {
    access_token,
    categoryId,
    subCategoryId,
    className,
    headChildren,
    footerChildren,
    bodyClassName,
    selectedItems,
    onSelectItems,
    renderSelectedItems,
    search,
    excludedEquipments,
    existingEquipmentOnly,
    existingEquipments,
    warehouse_id,
    isSoldItem
  } = props;
  const shippingDetails = useContext(ShippingDetailsContext);
  const shipping_id = shippingDetails ? shippingDetails['_shipping_id'] : null;

  const { data, isLoading, error, size, setSize, isValidating } = useSWRInfinite(
    (index) => {
      let paramsObj: any = {};
      let _category = categoryId;
      if (subCategoryId) {
        paramsObj['page'] = 1;
        paramsObj['sub_category_id'] = subCategoryId;
      }

      if (search) {
        paramsObj = {};
        paramsObj['search'] = search;
        paramsObj['page'] = 0;
        _category = null;
      }

      if (shipping_id) {
        paramsObj['_shipping_id'] = shipping_id
      }

      if (warehouse_id) {
        paramsObj['warehouse_id'] = warehouse_id;

      }

      paramsObj['page'] = index + 1;
      let searchParams = new URLSearchParams(paramsObj);

      if (isSoldItem) {
        return [
          `/api/projects/shipping/getAllItemSale`,
          access_token ?? session?.user?.access_token
        ];
      }

      return [
        existingEquipmentOnly ? null : `/api/items/category${(_category ? '/' + _category : '')}?${searchParams.toString()}`,
        access_token ?? session?.user?.access_token
      ];
    },
    fetchApi
  );


  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onCheckItemId = (isChecked: boolean, item: any) => {
    const _selectedItems = selectedItems ? [...selectedItems] : [];
    const selectedItemIdIndex = _selectedItems.findIndex((data: Item) => data._item_id === item._item_id);
    if (selectedItemIdIndex > -1 && !isChecked) _selectedItems.splice(selectedItemIdIndex, 1);
    else _selectedItems.push({ ...item, isSelected: false });
    onSelectItems && onSelectItems(_selectedItems);
  };

  const selectedItemOnChecked = (isChecked: boolean, item: Item) => {
    const _selectedItems = selectedItems ? [...selectedItems] : [];
    const selectedItemIdIndex = _selectedItems.findIndex((data: Item) => data._item_id === item._item_id);
    if (selectedItemIdIndex > -1) _selectedItems[selectedItemIdIndex].isSelected = isChecked;
    onSelectItems && onSelectItems(_selectedItems);
  };

  const getSingleSelectedItem = (_item_id: string | any) => {
    const _selectedItem = selectedItems ? selectedItems.find((data: any) => data._item_id === _item_id) : null;
    if (!_selectedItem) return null;
    return _selectedItem;
  };

  const onShippingListEquipment = (_item_id: any) => {
    if (excludedEquipments && Array.isArray(excludedEquipments))
      return excludedEquipments.find((item: Item) => item._item_id === _item_id);
    return null;
  };

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      if (renderSelectedItems) return;
      setSize(currentPage + 1);
    }
  }

  return (
    <ScrollArea onScrollEndViewPort={onscrollend} className={className}>
      {headChildren}
      <div className={bodyClassName}>
        {!renderSelectedItems && (
          _data && Array.isArray(_data) && _data[0] && _data[0].items.length === 0 && (
            <NoDataFound />
          )
        )}
        <div className="flex flex-col gap-1">
          {!renderSelectedItems ? (
            existingEquipments ? (
              <>
                {existingEquipments.map((item: any, key: number) => (
                  <ItemRow
                    key={key}
                    _item_id={item._item_id}
                    _highlightResult={null}
                    item_origin={item.shipping_item_country_of_origin}
                    item_name={item.shipping_item_name}
                    onShippingEquipment={false}
                    active={getSingleSelectedItem(item._item_id) ? getSingleSelectedItem(item._item_id)._item_id === item._item_id : false}
                    onCheckedChange={(isChecked: boolean) => onCheckItemId(isChecked, item)}
                    item_set_id={item.item_set_id}
                    current_quantity={item.current_quantity}
                    existingEquipmentOnly={existingEquipmentOnly}
                    item_image={item.item_image}
                  />
                ))}
                {Array.isArray(existingEquipments) && existingEquipments.length === 0 && (
                  <NoDataFound />
                )}
              </>
            ) : (
              <>
                {_data && Array.isArray(_data) && _data.map((data: any) => {
                  return data && Array.isArray(data.items) && data.items.map((item: ItemRow, key: number) => (
                    <ItemRow
                      key={key}
                      _item_id={item._item_id}
                      _highlightResult={item._highlightResult}
                      item_origin={item.item_origin}
                      item_name={item.item_name}
                      onShippingEquipment={onShippingListEquipment(item._item_id) ? true : false}
                      active={getSingleSelectedItem(item._item_id) ? getSingleSelectedItem(item._item_id)._item_id === item._item_id : false}
                      onCheckedChange={(isChecked: boolean) => onCheckItemId(isChecked, item)}
                      item_set_id={item.item_set_id}
                      current_quantity={item.current_quantity}
                      existingEquipmentOnly={existingEquipmentOnly}
                      item_image={item.item_image}
                      client_name={item.client_name}
                      isSold={isSoldItem}
                    />
                  ));
                })}
              </>
            )
          ) : (
            <SelectedItems
              selectedItems={selectedItems}
              onCheckItem={selectedItemOnChecked}
            />
          )}
        </div>
        {(isLoadingMore && !renderSelectedItems) && <LoadingMore />}
      </div>
      {footerChildren}
    </ScrollArea>
  )
}

export default memo(ItemSelect);

function SelectedItems(props: SelectedItemsProps) {
  const { selectedItems, onCheckItem } = props;

  if (Array.isArray(selectedItems) && selectedItems.length > 0) {
    return <>
      {selectedItems.map((item: Item | any, key: number) => (
        <ItemRow
          key={key}
          _item_id={item._item_id}
          _highlightResult={item._highlightResult}
          item_origin={item.item_origin || item.shipping_item_country_of_origin}
          item_name={item.item_name || item.shipping_item_name}
          item_set_id={item.item_set_id}
          active={item.isSelected}
          item_image={item.item_image}
          shippingCategory={item.shippingCategory}
          onCheckedChange={(isChecked: boolean) => onCheckItem && onCheckItem(isChecked, item)}
          current_quantity={item.current_quantity}
        />
      ))}
    </>;
  }
  return <NoDataFound />;
}

type SelectedItemsProps = {
  selectedItems?: Item[],
  onCheckItem?: (isChecked: boolean, item: Item) => void
}

function NoDataFound() {
  return (
    <div className="flex justify-center">
      <Image
        src="/images/No data-rafiki.svg"
        width={400}
        height={400}
        alt="No Data to Shown"
      />
    </div>
  );
}

export function ItemRow(props: ItemRow) {
  const {
    onCheckedChange,
    active,
    onShippingEquipment,
    shippingCategory,
    _item_id,
    _highlightResult,
    item_origin,
    item_name,
    item_set_id,
    current_quantity,
    existingEquipmentOnly,
    item_image,
    isSold,
    client_name
  } = props;

  const _disabled = () => {
    if (!isNaN(current_quantity) && Number(current_quantity) === 0) {
      return true;
    }
    return onShippingEquipment;
  }

  return (
    <label htmlFor={_item_id}
      className={cn(
        "flex justify-between hover:bg-stone-100 p-1 pe-3 items-center rounded-sm cursor-pointer",
        active && "bg-stone-100",
        _disabled() && 'cursor-default pointer-events-none'
      )}
    >
      <div className={cn("flex flex-col items-start gap-1", _disabled() && "opacity-50")}>
        {shippingCategory && (
          <div className="flex gap-1 items-center">
            <span className="text-sm text-stone-500">Category</span>
            <MoveRight className="text-violet-500 w-5 h-5" />
            <span className="text-stone-500 text-sm">
              {shippingCategory && shippingCategory.shipping_category_name}
            </span>
          </div>
        )}
        <div className="flex items-start gap-3">
          {item_set_id && (
            <div className="w-[15px] h-[15px] bg-purple-300 mt-1 rounded-full" />
          )}
          {!item_set_id && (
            <Image
              src={baseUrl + '/equipments/thumbnail/' + item_image}
              width={50}
              height={50}
              className="w-[50px] h-[50px] object-cover rounded-sm"
              alt={item_name || 'equipment'}
              onError={(e: any) => {
                e.target.srcset = `${baseUrl}/equipments/thumbnail/Coming_Soon.jpg`;
              }}
            />
          )}
          <div className="flex flex-col gap-1">
            <p className="font-medium">
              <Highlighter
                searchWords={_highlightResult ? _highlightResult.item_name.matchedWords : []}
                autoEscape={true}
                textToHighlight={item_name || ''}
              />
            </p>
            
            <div className="flex gap-2 items-center">
              {isSold ? (
                <span className="text-stone-700">
                  {client_name}
                </span>
              ) : (
                <>
                  {!existingEquipmentOnly && (
                    <>
                      <span className="text-stone-700">
                        {current_quantity} items
                      </span>
                      {item_origin && <div className="bg-stone-300 w-1 h-1" />}
                    </>
                  )}
                </>
              )}
              
              <p className="text-stone-700">{item_origin}</p>
            </div>
          </div>
        </div>
      </div>
      <Checkbox
        id={_item_id}
        className="rounded-full h-5 w-5 border-transparent bg-stone-300"
        onCheckedChange={onCheckedChange}
        checked={active}
        disabled={_disabled()}
      />
    </label>
  );
}

export type Item = {
  item_name?: string
  item_category_name?: string
  _item_category_id?: string
  _item_id?: string
  item_sub_category_name?: string
  with_serial?: string
  item_sub_category_index?: string
  item_construction_year?: string
  item_power?: string
  item_pressure?: string
  item_tension?: string
  item_kilowatt?: string
  item_rated_current?: string
  item_protection_class?: string
  item_number?: string
  item_origin?: string
  total_serial_numbers?: string
  _highlightResult?: any
  shippingCategory?: ShippingCategory
}

type ItemRow = {
  onCheckedChange?: (isChecked: boolean) => void
  active?: boolean
  onShippingEquipment?: boolean
  _item_id?: string
  shippingCategory?: any
  _highlightResult?: any
  item_origin?: any
  item_name?: any
  item_set_id?: any
  current_quantity?: any
  existingEquipmentOnly?: boolean
  item_image?: any
  isSold?: boolean
  client_name?: any
}

type ItemSelectProps = {
  access_token: string
  categoryId?: any
  subCategoryId?: any
  className?: string
  bodyClassName?: string
  headChildren?: React.ReactNode
  footerChildren?: React.ReactNode
  selectedItems?: any[]
  onSelectItems?: (item: any) => void
  renderSelectedItems?: boolean
  onChangedSelected?: (items: Item[]) => void
  search?: any
  excludedEquipments?: any[]
  existingEquipmentOnly?: boolean
  existingEquipments?: any
  warehouse_id?: number
  isSoldItem?: boolean
}