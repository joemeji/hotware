import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ItemMenu, TD, TH } from "../..";
import Pagination from "@/components/pagination";
import { Modal, actionMenu } from ".";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatter } from "@/utils/text";

export default function ListPrice({ _item_id, access_token, currencies }: any) {
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { 
    data: list_price_data, 
    isLoading: list_price_isLoading, 
    error: list_price_error, 
    mutate: list_price_mutate 
  } = useSWR(
    [`/api/items/${_item_id}/list_prices?page=${page}`, access_token], 
    fetchApi
  );

  const onClickAction = (actionType: string, price: any) => {
    if (actionType === 'edit') {
      setOpenEditModal(true);
      setIsEdit(true);
    }
  };

  const onClickAddPrice = () => {
    setOpenEditModal(true);
    setIsEdit(false);
  };

  return (
    <>
      <Modal
        title={isEdit ? "Edit List Price" : "Add List Price"}
        open={openEditModal}
        onOpenChange={setOpenEditModal}
      >
        <form className="p-5 border-t border-t-stone-200">
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

      <span className="flex text-lg mb-3 font-medium">List Price</span>
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex p-2 justify-between">
          <Input placeholder="Search" className="max-w-[300px]" />
          <Button className="p-2" variant="ghost" onClick={onClickAddPrice}>
            <Plus />
          </Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <TH className="font-medium ps-4 w-[30%]">Price</TH>
              <TH className="font-medium w-[30%]">Currency</TH>
              <TH className="font-medium text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
          {list_price_isLoading && (
            [1,2,3,4,5,6,7,8,9].map((item: any, key: number) => (
              <tr key={key}>
                <TD>
                  <Skeleton className="w-[70%] h-9" />
                </TD>
              </tr>
            ))
          )}
            {list_price_data && Array.isArray(list_price_data.items) && list_price_data.items.map((iv: any, key: number) => (
              <tr key={key} className="hover:bg-stone-100 ">
                <TD className="font-medium ps-4">
                  {iv.ilp_price ? formatter(iv.currency).format(iv.ilp_price) : ''}
                </TD>
                <TD>
                  <span>
                    {iv.currency}
                  </span>
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
        {list_price_data && list_price_data.pager && (
          <div className="mt-auto w-full border-t border-stone-100">
            <Pagination
              pager={list_price_data.pager}
              onPaginate={(page: number) => setPage(page)}
            />
          </div>
        )}
      </div>
    </>  
  );
}