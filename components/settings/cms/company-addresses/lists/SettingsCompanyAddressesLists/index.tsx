import { memo, useState } from "react";
import { ActionMenu, TD, TH, tableHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Loader2, Plus, PlusCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { DeleteTextModalConfirmModal } from "../../modals/DeleteTextModalConfirmModal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCmsOwner } from "../../schema";
import { toast } from "@/components/ui/use-toast";
import { NotCmsOwnerSelect } from "../../form/NotCmsOwnerSelect";

const SettingsCompanyAddressesLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/cms/company-addresses/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const cmsOwner = data?.cms_owner;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(addCmsOwner),
  });

  const addExclusiveVat = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/cms/company-addresses/create";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });

        mutate("/api/cms/company-addresses/cms-owner");
        mutate(listUrl);
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <div className='grid bg-white'>
      <DeleteTextModalConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex flex-col mb-7'>
          <h1 className='text-2xl font-light'>
            Manage Company Client/Suppliers
          </h1>
        </div>
        <div className='flex gap-2'>
          <form onSubmit={handleSubmit(addExclusiveVat)}>
            <div className='flex gap-3 min-w-[10rem]'>
              <div className='w-96'>
                <Controller
                  name='cms_id'
                  control={control}
                  defaultValue='Offer'
                  render={({ field }) => (
                    <NotCmsOwnerSelect
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    />
                  )}
                />
              </div>
              <Button variant='default' className='flex gap-1'>
                <PlusCircle {...iconProps} />
                Add Address
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className='p-3'>
        <div className='min-h-full'>
          <table className='w-full rounded-sm overflow-hidden p-5'>
            <thead>
              <tr>
                {tableHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {cmsOwner &&
                cmsOwner.length > 0 &&
                cmsOwner.map((cmsOwner: any, i: number) => {
                  return (
                    <tr key={i} className='text-center'>
                      <TD>{cmsOwner.cms_owner_id}</TD>
                      <TD className='text-left'>{cmsOwner.cms_name}</TD>
                      <TD>{cmsOwner?.company_name}</TD>
                      <TD>
                        <ActionMenu
                          onDelete={() => handleDelete(cmsOwner)}
                          data={{
                            id: cmsOwner.cms_owner_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && cmsOwner?.length == 0 && (
            <div className='text-center max-w-full p-5'>No records found</div>
          )}

          {isLoading && <Loader2 className='animate-spin mx-auto m-5' />}

          {pager && (
            <div className='mt-auto border-t border-t-stone-100 flex justify-end'>
              <Pagination pager={pager} onPaginate={onPaginate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsCompanyAddressesLists);
