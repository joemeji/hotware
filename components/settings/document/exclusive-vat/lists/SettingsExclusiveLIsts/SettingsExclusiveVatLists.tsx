import { useState } from "react";
import { ActionMenu, TD, TH, tableHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { DeleteTextModalConfirmModal } from "../../modals/DeleteTextModalConfirmModal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addVatDocument } from "../../schema";
import { VatTypeSelect } from "../../form/VatTypeSelect";
import { toast } from "@/components/ui/use-toast";
import { PER_PAGE } from "@/utils/algoliaConfig";

export const SettingsExclusiveVatLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/document/exclusive-vat/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const exclusiveVat = data?.company_vat;
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
    resolver: yupResolver(addVatDocument),
  });

  const addExclusiveVat = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/document/exclusive-vat/create";

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

        mutate(listUrl);

        setTimeout(() => {
          // onOpenChange && onOpenChange(false);
        }, 300);

        // if (onOpenChange) {
        //   onOpenChange(false);
        // }
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
    console.log("data", data);
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
        <div className='flex items-center justify-between '>
          <h1 className='text-2xl font-light mb-5'>Document Exclusive VAT</h1>
        </div>
        <div className='flex gap-2'>
          <form onSubmit={handleSubmit(addExclusiveVat)}>
            <div className='flex gap-3 col-span-5 xl:col-span-3 md:col-span-4 min-w-[200px]'>
              <Controller
                name='company_vat_type'
                control={control}
                defaultValue='Offer'
                render={({ field }) => (
                  <VatTypeSelect
                    onChangeValue={(value: any) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  />
                )}
              />
              <Button variant='red'>
                <ShoppingCart {...iconProps} />
                Add Document
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
              {exclusiveVat &&
                exclusiveVat.length > 0 &&
                exclusiveVat.map((exclusiveVat: any, i: number) => {
                  return (
                    <tr key={i} className=''>
                      <TD className='text-center'>
                      {(page - 1) * PER_PAGE + i + 1}
                      </TD>
                      <TD>{exclusiveVat?.company_vat_type}</TD>
                      <TD>{exclusiveVat?.company_name}</TD>
                      <TD>
                        <span className='p-2 rounded-full bg-green-500'>
                          ON
                        </span>
                      </TD>
                      <TD className='text-center'>
                        <ActionMenu
                          onDelete={() => handleDelete(exclusiveVat)}
                          data={{
                            id: exclusiveVat.text_block_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && exclusiveVat?.length == 0 && (
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
