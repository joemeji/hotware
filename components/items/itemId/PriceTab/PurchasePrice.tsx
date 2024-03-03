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
import unitTypes from "@/utils/unitTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Pagination from "@/components/pagination";
import { ItemMenu, TD, TH } from "../..";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatter } from "@/utils/text";
import MoreOption from "@/components/MoreOption";
import { useRouter } from "next/router";
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
import { AccessTokenContext } from "@/context/access-token-context";
import CmsSelect from "@/components/app/cms-select";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const yupSchema = yup.object({
  ipp_price: yup
    .number()
    .min(0, "Amount must be a positive number.")
    .typeError("Amount must be a number"),
  ipp_unit: yup.string(),
  cms_id: yup.string().required("This field is required."),
  currency_id: yup.string().required("Currency is required."),
});

export default function PurchasePrice({ currencies }: any) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPurchasePrice, setSelectedPurchasePrice] = useState<any>(null);
  const [page, setPage] = useState(1);
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
    data: purchase_price_data,
    isLoading: purchase_price_isLoading,
    error: purchase_price_error,
    mutate: purchase_price_mutate,
  } = useSWR(
    [
      `/api/items/${router.query.item_id}/purchase_prices?page=${page}`,
      access_token,
    ],
    fetchApi
  );

  const onClickAction = (actionType: string, purchase_price: any) => {
    if (actionType === "edit") {
      setSelectedPurchasePrice(purchase_price);
      setOpenEditModal(true);
      setIsEdit(true);
      setValue("cms_id", purchase_price.cms_id);
      setValue("ipp_unit", purchase_price.ipp_unit);
      setValue("currency_id", purchase_price.currency_id);
      setValue("ipp_price", purchase_price.ipp_price);
    }
    if (actionType === "delete") {
      setSelectedPurchasePrice(purchase_price);
      setOpenAlertMessage(true);
    }
  };

  const onClickAddPurchasePrice = () => {
    setIsEdit(false);
    setOpenEditModal(true);
  };

  const onDelete = async () => {
    try {
      setalertLoading(true);
      const res = await fetch(
        `${baseUrl}/api/items/delete_ipp/${selectedPurchasePrice?.ipp_id}`,
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
        purchase_price_mutate(purchase_price_data);
        setSelectedPurchasePrice(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setalertLoading(false);
    }
  };

  const onSubmitEditForm = async (data: any) => {
    try {
      setSubmitting(true);

      let uri = "";

      if (isEdit) {
        uri += `${baseUrl}/api/items/update_ipp/${selectedPurchasePrice?.ipp_id}`;
      } else {
        uri = `${baseUrl}/api/items/add_ipp`;
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
            ? "Added successfully."
            : "Updated successfully.",
        });
        setOpenEditModal(false);
        purchase_price_mutate(purchase_price_data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
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
                setSelectedPurchasePrice(null);
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
        title={isEdit ? "Edit Purchase Price" : "Add Purchase Price"}
        open={openEditModal}
        onOpenChange={setOpenEditModal}
      >
        <form
          className="p-5 border-t border-t-stone-200"
          onSubmit={handleSubmit(onSubmitEditForm)}
        >
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Supplier</label>
            <Controller
              name="cms_id"
              control={control}
              render={({ field }) => (
                <CmsSelect
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors?.cms_id}
                  defaultValue={selectedPurchasePrice?.cms_id}
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Unit</label>
            <Input
              className="h-11 border-0 rounded-xl bg-stone-100"
              placeholder="Unit"
              {...register("ipp_unit")}
              error={errors && (errors.ipp_unit ? true : false)}
            />
            <span className="text-red-400 text-sm mt-1 flex">
              {errors && errors.ipp_unit?.message}
            </span>
          </div>
          <div className="mb-4">
            <label className="mb-2 flex font-medium">Currency</label>
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
            <label className="mb-2 flex font-medium">Price</label>
            <Input
              className="h-11 border-0 bg-stone-100 rounded-xl"
              placeholder="Price"
              {...register("ipp_price")}
              error={errors && (errors.ipp_price ? true : false)}
            />
            <span className="text-red-400 text-sm mt-1 flex">
              {errors && errors.ipp_price?.message}
            </span>
          </div>

          <div className="text-right">
            <Button
              className={cn("rounded-xl", submitting && "loading")}
              disabled={submitting}
              type="submit"
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <span className="flex text-lg mb-3 font-medium">Purchase Price</span>
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex p-2 justify-between">
          <Input placeholder="Search" className="max-w-[300px]" />
          <Button
            className="p-2"
            variant="ghost"
            onClick={onClickAddPurchasePrice}
          >
            <Plus />
          </Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <TH className="font-medium ps-4 w-[30%]">Supplier</TH>
              <TH className="font-medium w-[15%]">Unit</TH>
              <TH className="font-medium w-[15%]">Currency</TH>
              <TH>Price</TH>
              <TH className="font-medium text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {purchase_price_isLoading &&
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
                  <TD>
                    <Skeleton className="w-[100%] h-9" />
                  </TD>
                </tr>
              ))}
            {purchase_price_data &&
              Array.isArray(purchase_price_data.items) &&
              purchase_price_data.items.map((iv: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100">
                  <TD className="font-medium ps-4 py-3.5">{iv.cms_name}</TD>
                  <TD className="py-3.5">{iv.ipp_unit}</TD>
                  <TD className="py-3.5">{iv.currency}</TD>
                  <TD className="py-3.5">
                    {iv.ipp_price
                      ? formatter(iv.currency).format(iv.ipp_price)
                      : ""}
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
        {purchase_price_data && purchase_price_data.pager && (
          <div className="mt-auto w-full border-t border-stone-100">
            <Pagination
              pager={purchase_price_data.pager}
              onPaginate={(page: number) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </>
  );
}
