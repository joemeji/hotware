import { memo, useEffect, useState } from "react";
import { ActionMenu, TD, TH, tableCountryHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { toast } from "@/components/ui/use-toast";
import { CountryModal } from "../../modals/CountryModal";
import { DeleteCountryConfirmModal } from "../../modals/DeleteCountryConfirmModal";
import { PER_PAGE } from "@/utils/algoliaConfig";

const SettingsCountryLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/country/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const countries = data?.countries;
  const pager = data?.pager;

  const handleDelete = async (id: string, countryName: string) => {
    setSelectedId(id);
    setSelectedCountry(countryName);
    setOpenConfirmDeleteModal(true);
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setOpencountryModal(true);
  };

  const [selectedId, setSelectedId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [opencountryModal, setOpencountryModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  return (
    <div className="grid bg-white">
      <CountryModal
        open={opencountryModal}
        id={selectedId}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpencountryModal(open)}
      />
      <DeleteCountryConfirmModal
        open={openConfirmDeleteModal}
        countryName={selectedCountry}
        id={selectedId}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenConfirmDeleteModal(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-light mb-5">Manage Countries</h1>
          <div className="flex gap-2">
            <div>
              <Input
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button
              variant="red"
              onClick={() => {
                setOpencountryModal(true);
                setSelectedId("");
              }}
            >
              <Plus {...iconProps} />
              Add country
            </Button>
          </div>
        </div>
      </div>
      <div className="p-3 ">
        <div className="min-h-full">
          <table className="w-full rounded-sm overflow-hidden p-5 table-auto">
            <thead>
              <tr>
                {tableCountryHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {countries &&
                countries.length > 0 &&
                countries.map((country: any, i: number) => {
                  return (
                    <tr key={i}>
                      <TD>{(page - 1) * PER_PAGE + i + 1}</TD>
                      <TD>{country.country_name}</TD>
                      <TD className="text-center">
                        {country?.country_details_maximum_working_hrs_per_day ??
                          "--"}
                      </TD>
                      <TD className="text-center">
                        {country?.country_details_maximum_working_hrs_per_week ??
                          "--"}
                      </TD>
                      <TD className="text-center">
                        {country?.country_details_sunday_work_allowed == "1" &&
                          "Yes"}
                        {country?.country_details_sunday_work_allowed == "0" &&
                          "No"}
                        {!country.country_details_sunday_work_allowed && "--"}
                      </TD>
                      <TD className="text-center">
                        {country?.country_details_installation_on_sunday ==
                          "1" && "Yes"}
                        {country?.country_details_installation_on_sunday ==
                          "0" && "No"}
                        {!country.country_details_installation_on_sunday &&
                          "--"}
                      </TD>
                      <TD>
                        <ActionMenu
                          onDelete={() =>
                            handleDelete(
                              country.country_id,
                              country.country_name
                            )
                          }
                          onEdit={() => handleEdit(country.country_id)}
                          data={{
                            id: country.country_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && countries?.length == 0 && (
            <div className="text-center max-w-full p-5">No records found</div>
          )}

          {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}

          {pager && (
            <div className="mt-auto border-t border-t-stone-100 flex justify-end">
              <Pagination pager={pager} onPaginate={onPaginate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsCountryLists);
