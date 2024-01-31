import { fetchApi } from "@/utils/api.config";
import { useState } from "react";
import useSWR from "swr";
import { Modal, actionMenu } from ".";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import unitTypes from "@/utils/unitTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Pagination from "@/components/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ItemMenu, TD, TH } from "../..";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatter } from "@/utils/text";

export default function PurchasePrice({ _item_id, access_token, currencies }: any) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPurchasePrice, setSelectedPurchasePrice] = useState(null);
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);

  const { 
    data: purchase_price_data, 
    isLoading: purchase_price_isLoading, 
    error: purchase_price_error, mutate: 
    purchase_price_mutate 
  } = useSWR(
    [`/api/items/${_item_id}/purchase_prices?page=${page}`, access_token], 
    fetchApi
  );

  const onClickAction = (actionType: string, purchase_price: any) => {
    if (actionType === 'edit') {
      setSelectedPurchasePrice(purchase_price);
      setOpenEditModal(true);
      setIsEdit(true);
    }
  };

  const onClickAddPurchasePrice = () => {
    setIsEdit(false);
    setOpenEditModal(true);
  }
  
  return (
    <>
      <Modal
        title={isEdit ? "Edit Purchase Price" : "Add Purchase Price"}
        open={openEditModal}
        onOpenChange={setOpenEditModal}
      >
        <form className="p-5 border-t border-t-stone-200">
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Supplier</label>
            <Select>
              <SelectTrigger className="border h-11 w-full rounded-xl">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((unitType: string, key: number) => (
                  <SelectItem value={unitType} key={key} className="cursor-pointer">
                    {unitType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Unit</label>
            <Input className="h-11" placeholder="Unit" />
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Currency</label>
            <Select>
              <SelectTrigger className="border h-11 w-full rounded-xl">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency: any, key: number) => (
                  <SelectItem value={currency.currency_id} key={key} className="cursor-pointer">
                    {currency.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Price</label>
            <Input className="h-11" placeholder="Price" />
          </div>

          <div className="text-right">
            <Button>Save</Button>
          </div>
        </form>
      </Modal>

      <span className="flex text-lg mb-3 font-medium">Purchase Price</span>
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex p-2 justify-between">
          <Input placeholder="Search" className="max-w-[300px]" />
          <Button className="p-2" variant="ghost" onClick={onClickAddPurchasePrice}>
            <Plus />
          </Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <TH className="font-medium ps-4 w-[30%]">Supplier</TH>
              <TH className="font-medium w-[15%]">Unit</TH>
              <TH className="font-medium w-[15%]">Currency</TH>
              <TH >Price</TH>
              <TH className="font-medium text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {purchase_price_isLoading && (
              [1,2,3,4,5,6,7,8,9].map((item: any, key: number) => (
                <tr key={key}>
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                </tr>
              ))
            )}
            {purchase_price_data && Array.isArray(purchase_price_data.items) && purchase_price_data.items.map((iv: any, key: number) => (
              <tr key={key} className="hover:bg-stone-100">
                <TD className="font-medium ps-4 py-3.5">
                  {iv.cms_name}
                </TD>
                <TD className="py-3.5">
                  {iv.ipp_unit}
                </TD>
                <TD className="py-3.5">
                  {iv.currency}
                </TD>
                <TD className="py-3.5">
                  {iv.ipp_price ? formatter(iv.currency).format(iv.ipp_price) : ''}
                </TD>
                <TD className="pe-4 text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border border-stone-50">
                      {[...actionMenu].map((action, key) => (
                        <ItemMenu key={key}
                          onClick={() => onClickAction(action.actionType, iv)}
                        >
                          {action.icon}
                          <span className="text-stone-600 text-sm">
                            {action.name}
                          </span>
                        </ItemMenu>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
        {purchase_price_data && purchase_price_data.pager && (
          <div className="mt-auto w-full border-t border-stone-100">
            <Pagination
              pager={purchase_price_data.pager}
              onPaginate={(page: number) => setPage(page)}
            />
          </div>
        )}
      </div>
    </>  
  );
}