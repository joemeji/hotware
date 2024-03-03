import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { Plus } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { ItemMenu, TD, TH } from "../..";
import Pagination from "@/components/pagination";
import { Modal, actionMenu } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatter } from "@/utils/text";
import MoreOption from "@/components/MoreOption";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
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
  ilp_price: yup
    .number()
    .min(0, "Amount must be a positive number.")
    .typeError("Amount must be a number"),
  currency_id: yup.string().required("Currency is required."),
});

export default function ListPrice({ _item_id, access_token, currencies }: any) {
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertLoading, setalertLoading] = useState(false);
  const router = useRouter();

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
    data: list_price_data,
    isLoading: list_price_isLoading,
    error: list_price_error,
    mutate: list_price_mutate,
  } = useSWR(
    [`/api/items/${_item_id}/list_prices?page=${page}`, access_token],
    fetchApi
  );

  const onClickAction = (actionType: string, price: any) => {
    if (actionType === "edit") {
      setOpenEditModal(true);
      setIsEdit(true);
      setSelectedPrice(price);
      setValue("currency_id", price.currency_id);
      setValue("ilp_price", price.ilp_price);
    }

    if (actionType === "delete") {
      setOpenAlertMessage(true);
      setSelectedPrice(price);
    }
  };

  const onClickAddPrice = () => {
    setOpenEditModal(true);
    setIsEdit(false);
  };

  const onSubmitEditForm = async (data: any) => {
    try {
      setSubmitting(true);

      let uri = "";

      if (isEdit) {
        uri += `${baseUrl}/api/items/update_list_price/${selectedPrice?.ilp_id}`;
      } else {
        uri = `${baseUrl}/api/items/add_list_price`;
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
            ? "Item Price added successfully."
            : "Item Price updated successfully.",
        });
        setOpenEditModal(false);
        list_price_mutate(list_price_data);
        reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    try {
      setalertLoading(true);
      const res = await fetch(
        `${baseUrl}/api/items/delete_list_price/${selectedPrice?.ilp_id}`,
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
        list_price_mutate(list_price_data);
        selectedPrice(null);
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
                setSelectedPrice(null);
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
        title={isEdit ? "Edit List Price" : "Add List Price"}
        open={openEditModal}
        onOpenChange={setOpenEditModal}
      >
        <form
          className="p-5 border-t border-t-stone-200"
          onSubmit={handleSubmit(onSubmitEditForm)}
        >
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Currency</label>
            <Controller
              name="currency_id"
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
            <span className="text-red-400 text-sm mt-1 flex">
              {errors && errors.currency_id?.message}
            </span>
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Price</label>
            <Input
              className="h-11 bg-stone-100 rounded-xl border-0"
              placeholder="Price"
              defaultValue={0}
              {...register("ilp_price")}
              error={errors && (errors.ilp_price ? true : false)}
            />
            <span className="text-red-400 text-sm mt-1 flex">
              {errors && errors.ilp_price?.message}
            </span>
          </div>

          <div className="text-right">
            <Button
              disabled={submitting}
              className={cn("rounded-xl", submitting && "loading")}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
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
            {list_price_isLoading &&
              [1, 2].map((item: any, key: number) => (
                <tr key={key}>
                  <TD>
                    <Skeleton className="w-[70%] h-9" />
                  </TD>
                </tr>
              ))}
            {list_price_data &&
              Array.isArray(list_price_data.items) &&
              list_price_data.items.map((iv: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100 ">
                  <TD className="font-medium ps-4">
                    {iv.ilp_price
                      ? formatter(iv.currency).format(iv.ilp_price)
                      : ""}
                  </TD>
                  <TD>
                    <span>{iv.currency}</span>
                  </TD>
                  <TD className="pe-4 text-right">
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
        {list_price_data && list_price_data.pager && (
          <div className="mt-auto w-full border-t border-stone-100">
            <Pagination
              pager={list_price_data.pager}
              onPaginate={(page: number) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </>
  );
}
