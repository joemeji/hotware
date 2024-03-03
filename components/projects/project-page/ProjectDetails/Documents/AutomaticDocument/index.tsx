import { getDateToday } from "@/components/documents/employees/list/header";
import { TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import {
  ChevronDown,
  Download,
  DownloadCloud,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import AutoDocumentFilter, { document_type_format } from "./AutoDocumentFilter";

const SelectedDocumentIdContext: any = createContext([]);

const AutomaticDocument = () => {
  const access_token = useContext(AccessTokenContext);
  const project = useContext(ProjectDetailsContext);
  const [page, setPage] = useState(1);
  const [selectedDocId, setSelectedDocId] = useState([]);
  const [filterValue, setFilterValue] = useState<any>({});

  const payload: any = { page };
  const filters: any = extractedFilterValues(filterValue);

  filters.forEach((item: any) => {
    payload[item.name] = item.id;
  });

  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, error, mutate } = useSWR(
    [
      project?.data?._project_id &&
        `/api/projects/${project?.data?._project_id}/document?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onCheckDoc = (docId: any) => {
    const _selectedDocId: any = [...selectedDocId];
    const selectedIdIndex = _selectedDocId.findIndex((id: any) => id === docId);

    if (selectedIdIndex > -1) _selectedDocId.splice(selectedIdIndex, 1);
    else _selectedDocId.push(docId);

    setSelectedDocId(_selectedDocId);
  };

  const checkedDoc = (docId: any) => {
    const _selectedDocId = [...selectedDocId];
    const selectedId = _selectedDocId.find((id: any) => id === docId);

    if (selectedId) return true;
    return false;
  };

  const onCheckAllDoc = (checked: boolean) => {
    if (Array.isArray(data?.list)) {
      const _selectedDocId = data.list.map((item: any) => item.document_id);

      if (checked) setSelectedDocId(_selectedDocId);
      else setSelectedDocId([]);
    } else {
      setSelectedDocId([]);
    }
  };

  const onRemoveFilter = (filter: any) => {
    const _filterValue = { ...filterValue };
    if (_filterValue[filter.type]) {
      delete _filterValue[filter.type];
      setFilterValue(_filterValue);
    }
  };

  return (
    <SelectedDocumentIdContext.Provider value={selectedDocId}>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-base font-medium">
          Automatically Generated Documentation
        </p>
        <div className="flex bg-background rounded-xl w-full flex-col overflow-hidden shadow">
          <AutomaticDocumentHeading
            dataList={data?.list}
            filterValue={filterValue}
            onChangeFilterValue={(filterValue) => setFilterValue(filterValue)}
            onRemoveFilter={onRemoveFilter}
          />
          <table className="w-full">
            <thead>
              <tr>
                <TH className="align-middle">
                  <div className="flex">
                    <Checkbox
                      className="w-[16px] h-[16px] rounded-none"
                      onCheckedChange={onCheckAllDoc}
                    />
                  </div>
                </TH>
                <TH>Owner</TH>
                <TH>Document</TH>
                <TH>Description</TH>
                <TH>Category</TH>
                <TH>Expiry Date</TH>
                <TH>Language</TH>
                <TH className="pe-4 text-right">File</TH>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.list) &&
                data.list.map((item: any, key: number) => (
                  <tr key={key}>
                    <TD>
                      <Checkbox
                        className="w-[16px] h-[16px] rounded-none"
                        checked={checkedDoc(item.document_id)}
                        onCheckedChange={(checked) =>
                          onCheckDoc(item.document_id)
                        }
                      />
                    </TD>
                    <TD>
                      <div className="flex items-center">
                        <span
                          className="flex"
                          dangerouslySetInnerHTML={{ __html: item.doc_image }}
                        />
                        <span>{item.document_owner}</span>
                      </div>
                    </TD>
                    <TD>{item.document_name}</TD>
                    <TD>{item.document_description}</TD>
                    <TD>{item.document_category_name}</TD>
                    <TD>
                      <div className="flex flex-col gap-1">
                        <span>{item.document_expiry_date}</span>
                        <span>
                          <ExpiredStatus status={item.expiration_status} />
                        </span>
                      </div>
                    </TD>
                    <TD>{item.document_language_name}</TD>
                    <TD className="pe-4 text-right">
                      <DownloadBtn item={item} />
                    </TD>
                  </tr>
                ))}

              {(project?.isLoading || isLoading) && (
                <tr>
                  <td className="px-3 py-2" colSpan={6}>
                    <Loader2 className="animate-spin mx-auto m-5" />
                  </td>
                </tr>
              )}

              {Array.isArray(data?.list) && data.list.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-5 opacity-50 text-center font-bold text-lg"
                  >
                    No Records Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {data?.pager && (
            <Pagination
              onPaginate={(_page) => setPage(_page)}
              pager={data.pager}
              currPage={page}
            />
          )}
        </div>
      </div>
    </SelectedDocumentIdContext.Provider>
  );
};

export default AutomaticDocument;

const extractedFilterValues = (filterValue: any) => {
  const filters = [];

  if (filterValue) {
    for (let [key, value] of Object.entries(filterValue)) {
      const payload: any = { type: key };
      const _value: any = value;

      if (key === "document_category") {
        payload.id = _value.document_category_id;
        payload.text = _value.document_category_name;
        payload.name = "document_category_id";
      }

      if (key === "document_type") {
        payload.id = document_type_format(_value.document_type_name);
        payload.text = _value.document_type_name;
        payload.name = "document_type";
      }

      if (key === "language") {
        payload.id = _value.document_language_id;
        payload.text = _value.document_language_name;
        payload.name = "document_language";
      }

      if (key === "requirement_level") {
        payload.id = _value.document_level_id;
        payload.text = _value.document_level_name;
        payload.name = "document_level_id";
      }

      filters.push(payload);
    }
  }

  return filters;
};

const AutomaticDocumentHeading = ({
  dataList,
  filterValue,
  onChangeFilterValue,
  onRemoveFilter,
}: {
  dataList?: any;
  filterValue?: any;
  onChangeFilterValue?: (filterValue: any) => void;
  onRemoveFilter?: (filterValue?: any) => void;
}) => {
  const selectedDocIds: any = useContext(SelectedDocumentIdContext);
  const [loading, setLoading] = useState(false);
  const access_token = useContext(AccessTokenContext);

  const onDownload = async () => {
    let _selectedDocIds = [];

    if (Array.isArray(selectedDocIds) && selectedDocIds.length > 0) {
      _selectedDocIds = selectedDocIds;
    } else {
      if (Array.isArray(dataList)) {
        _selectedDocIds = dataList.map((doc?: any) => doc.document_id);
      }
    }

    if (_selectedDocIds.length > 0) {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/document/download_files`, {
          method: "POST",
          body: JSON.stringify({
            files: _selectedDocIds.map((id: any) => ({ id })),
          }),
          headers: authHeaders(access_token),
        });
        const blob = await res.blob();

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.download = `FILES_${getDateToday()}.zip`;
        a.target = "_blank";
        a.href = blobUrl;
        a.click();
        setLoading(false);
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex p-3 justify-between">
      <div>
        {Array.isArray(dataList) && dataList.length > 0 && (
          <Button
            className={cn("py-1 flex items-center gap-2", loading && "loading")}
            variant={"outline"}
            onClick={onDownload}
            disabled={loading}
          >
            <Download className="w-[18px] text-purple-600" /> Download{" "}
            {Array.isArray(selectedDocIds) && selectedDocIds.length > 0
              ? "Selected"
              : "All"}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        {extractedFilterValues(filterValue).map((item: any, key: number) => (
          <div
            key={key}
            className="text-[12px] bg-stone-100 flex items-center gap-2 rounded-xl p-1 ps-2 "
          >
            <span>{item.text}</span>
            <button
              onClick={() => onRemoveFilter && onRemoveFilter(item)}
              className="bg-red-100 hover:bg-red-200 w-[14px] h-[14px] justify-center flex items-center rounded-full"
            >
              <X className="w-[12px]" />
            </button>
          </div>
        ))}

        <AutoDocumentFilter
          onChangeFilter={(value) => {
            let _value: any = {};
            if (filterValue) _value = { ...filterValue, ...value };
            onChangeFilterValue && onChangeFilterValue(_value);
          }}
          filterValue={filterValue}
        />
        <form>
          <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
            <Search className="text-stone-400 w-5 h-5" />
            <input
              placeholder="Search"
              className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
              name="search"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const DownloadBtn = ({ item }: { item?: any }) => {
  const [loading, setLoading] = useState(false);
  const access_token = useContext(AccessTokenContext);

  const onDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/document/download_document`, {
        method: "POST",
        body: JSON.stringify({ id: item.document_id }),
        headers: authHeaders(access_token),
      });
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.download = item.document_file_name;
      a.target = "_blank";
      a.href = blobUrl;
      a.click();
      setLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Button
      className={cn("px-2.5 py-1.5 text-purple-600", loading && "loading")}
      variant={"secondary"}
      title="Download"
      onClick={onDownload}
      disabled={loading}
    >
      <DownloadCloud className="w-[17px]" />
    </Button>
  );
};

const ExpiredStatus = ({ status: statusName }: { status: any }) => {
  if (!statusName) return <></>;

  return (
    <div
      className={cn(
        "bg-[rgb(255,118,118)] text-white w-fit px-3 py-[2px] rounded-full",
        "font-medium",
        "flex items-center"
      )}
    >
      {statusName}
    </div>
  );
};
