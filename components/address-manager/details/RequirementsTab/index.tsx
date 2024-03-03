import { TD, TH } from "@/components/items";
import { Input } from "@/components/ui/input";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { fetchApi } from "@/utils/api.config";
import { LayoutList } from "lucide-react";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import Pagination from "@/components/pagination";
import { AccessTokenContext } from "@/context/access-token-context";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import RequirementListModal from "./modals/RequirementListModal";
import SearchInput from "@/components/app/search-input";

const RequirementsTab = () => {
  const cms: any = useContext(CmsDetailsContext);
  const [page, setPage] = useState(1);
  const access_token = useContext(AccessTokenContext);
  const [listOpen, setListOpen] = useState(false);
  const [document_level_id, set_document_level_id] = useState(null);
  const [document_level_name, set_document_level_name] = useState(null);
  const [search, setSearch] = useState<any>(null);

  const queryString = new URLSearchParams({
    page: String(page),
    search: search,
  }).toString();

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/cms/requirements_levels/${cms?._cms_id}?${queryString}`,
      access_token,
    ],
    fetchApi
  );

  const onViewReqLevel = (document_level_id: any, document_level_name: any) => {
    setListOpen(true);
    set_document_level_id(document_level_id);
    set_document_level_name(document_level_name);
  };

  return (
    <>
      <RequirementListModal
        open={listOpen}
        onOpenChange={(open: any) => setListOpen(open)}
        document_level_id={document_level_id}
        document_level_name={document_level_name}
      />

      <div className="flex flex-col gap-3 border rounded-xl">
        <div className="pt-4 px-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Requirements</span>
            <div className="flex items-center gap-2">
              <SearchInput
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                delay={500}
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">#</TH>
              <TH>Requirement Level</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data?.list) && data.list.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <div className="flex justify-center">
                    <Image
                      src="/images/No data-rafiki.svg"
                      width={300}
                      height={300}
                      alt="No Data to Shown"
                    />
                  </div>
                </td>
              </tr>
            )}

            {isLoading && (
              <tr>
                <td className="p-2 pt-4 text-center" colSpan={3}>
                  <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[100px] h-[20px]" />
                  </div>
                </td>
              </tr>
            )}

            {Array.isArray(data?.list) &&
              data.list.map((item: any, key: number) => (
                <tr key={key} className="group hover:bg-stone-100">
                  <TD className="ps-4 font-medium">{data.offset + key + 1}</TD>
                  <TD className="group-last:border-b-0 font-medium">
                    {item.document_level_name}
                  </TD>
                  <TD className="text-right group-last:border-b-0">
                    <button
                      className="hover:bg-stone-300 bg-transparent p-2 rounded-xl"
                      onClick={() =>
                        onViewReqLevel(
                          item.document_level_id,
                          item.document_level_name
                        )
                      }
                    >
                      <LayoutList className="w-[24px]" />
                    </button>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
        {data?.pager && (
          <div className="mt-auto border-t border-t-stone-100">
            <Pagination
              pager={data.pager}
              onPaginate={(page: any) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(RequirementsTab);
