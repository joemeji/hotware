import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useContext, useState } from "react";
import useSWR from "swr";
import { Modal, actionMenu } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Pagination from "@/components/pagination";
import { ItemMenu, TD, TH } from "../..";
import { Skeleton } from "@/components/ui/skeleton";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatter } from "@/utils/text";
import MoreOption from "@/components/MoreOption";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const yupSchema = yup.object({
  iv_amount: yup
    .number()
    .min(0, "Amount must be a positive number.")
    .typeError("Amount must be a number"),
  iv_category: yup.string().required("Category is required."),
  currency_id: yup.string().required("Currency is required."),
});

export default function ItemValues({ currencies }: any) {
  const [page, setPage] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItemValue, setSelectedItemValue] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertLoading, setalertLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const {
    data: item_value_data,
    isLoading: item_value_isLoading,
    error: item_value_error,
    mutate: item_value_mutate,
  } = useSWR(
    [
      `/api/items/${router.query.item_id}/item_values?page=${page}`,
      access_token,
    ],
    fetchApi
  );

  const onClickAction = (actionType: string, itemValue: any) => {
    if (actionType === "edit") {
      setSelectedItemValue(itemValue);
      setOpenEditModal(true);
      setIsEdit(true);
      setValue("iv_category", itemValue.iv_category);
      setValue("currency_id", itemValue.currency_id);
      setValue("iv_amount", itemValue.iv_amount);
    }

    if (actionType === "delete") {
      setSelectedItemValue(itemValue);
      setOpenAlertMessage(true);
    }
  };

  const onSubmitEditForm = async (data: any) => {
    try {
      setSubmitting(true);

      let uri = "";

      if (isEdit) {
        uri += `${baseUrl}/api/items/update_item_value/${selectedItemValue?.iv_id}`;
      } else {
        uri = `${baseUrl}/api/items/add_item_value`;
      }

      const _data = { ...data, _item_id: router.query.item_id };

      const res = await fetch(uri, {
        method: "post",
        headers: authHeaders(access_token),
        body: JSON.stringify(_data),
      });
      const json = await res.json();

      if (json.success) {
        toast({
          variant: "success",
          duration: 2000,
          description: !isEdit
            ? "Item Value added successfully."
            : "Item Value updated successfully.",
        });
        setOpenEditModal(false);
        item_value_mutate(item_value_data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onClickAdd = () => {
    setOpenEditModal(true);
    setIsEdit(false);
    setValue("iv_category", "");
    setValue("currency_id", "");
    setValue("iv_amount", 0);
  };

  const onDelete = async () => {
    try {
      setalertLoading(true);
      const res = await fetch(
        `${baseUrl}/api/items/delete_item_value/${selectedItemValue?.iv_id}`,
        {
          method: "delete",
          headers: authHeaders(access_token),
        }
      );
      const json = await res.json();
      if (json.success) {
        toast({
          variant: "success",
          duration: 2000,
          description: "Deleted successfully.",
        });
        setOpenAlertMessage(false);
        item_value_mutate(item_value_data);
        setSelectedItemValue(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setalertLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"You won't be able to retrieve this."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={alertLoading}
              onClick={() => {
                setOpenAlertMessage(false);
                setSelectedItemValue(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={alertLoading}
              onClick={onDelete}
              className={cn(alertLoading && "loading")}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        title={isEdit ? "Edit Item Value" : "Add Item Value"}
        open={openEditModal}
        onOpenChange={(open) => {
          setOpenEditModal(open);
          if (!open) {
            reset();
            setSelectedItemValue(null);
          }
        }}
      >
        <form
          className="p-5 border-t border-t-stone-100"
          onSubmit={handleSubmit(onSubmitEditForm)}
        >
          <div className="mb-4">
            <label className="mb-2 flex">Category</label>
            <Controller
              name="iv_category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value: any) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="border-0 bg-stone-100 h-11 w-full rounded-xl text-left">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="used"
                      className="cursor-pointer hover:bg-stone-100"
                    >
                      Used
                    </SelectItem>
                    <SelectItem
                      value="new"
                      className="cursor-pointer hover:bg-stone-100"
                    >
                      New
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 flex">Currency</label>
            <Controller
              name="currency_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="border-0 bg-stone-100 h-11 w-full rounded-xl text-left">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency: any, key: number) => (
                      <SelectItem
                        value={currency.currency_id}
                        key={key}
                        className="cursor-pointer hover:bg-stone-100"
                      >
                        {currency.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 flex">Amount</label>
            <Input
              className="h-11 rounded-xl border-0 bg-stone-100"
              placeholder="Amount"
              {...register("iv_amount")}
              error={errors && (errors.iv_amount ? true : false)}
            />
            <span className="text-red-400 text-sm mt-1 flex">
              {errors && errors.iv_amount?.message}
            </span>
          </div>
          <div className="text-right">
            <Button
              className={cn("rounded-xl", submitting && "loading")}
              disabled={submitting}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <span className="flex text-lg mb-3 font-medium">Item Values</span>
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex p-2 justify-between">
          <Input placeholder="Search" className="max-w-[300px]" />
          <Button className="p-2" variant="ghost" onClick={onClickAdd}>
            <Plus />
          </Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <TH className="ps-4 w-[140px] text-center">Value</TH>
              <TH className="w-[30%]">Currency</TH>
              <TH>Category</TH>
              <TH className="text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {item_value_isLoading &&
              [1, 2].map((item: any, key: number) => (
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
                </tr>
              ))}
            {item_value_data &&
              Array.isArray(item_value_data.items) &&
              item_value_data.items.map((iv: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100">
                  <TD className="font-medium ps-4 text-right pe-5">
                    {iv.iv_amount
                      ? formatter(iv.currency).format(iv.iv_amount)
                      : ""}
                  </TD>
                  <TD>
                    <span>{iv.currency}</span>
                  </TD>
                  <TD>{iv.iv_category}</TD>
                  <TD className="text-right pe-4">
                    {/* <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border border-stone-50"
                      >
                        
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                    <MoreOption>
                      {[...actionMenu].map((action, key) => (
                        <ItemMenu
                          key={key}
                          onClick={() => onClickAction(action.actionType, iv)}
                        >
                          {action.icon}
                          <span className="font-medium text-sm">
                            {action.name}
                          </span>
                        </ItemMenu>
                      ))}
                    </MoreOption>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
        {item_value_data && item_value_data.pager && (
          <div className="mt-auto w-full border-t border-stone-100">
            <Pagination
              pager={item_value_data.pager}
              onPaginate={(page: number) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </>
  );
}
