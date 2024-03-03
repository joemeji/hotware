import { PER_PAGE, client } from "@/utils/algoliaConfig";
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import itemQrCodeDraw, {
  generateQrCode,
  itemTypePlate,
} from "@/utils/itemQrCodeDraw";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { SelectAll, TH, actionMenu } from "..";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/pagination";
import ActionButtonHeader from "../ActionButtonHeader";
import ItemEquipmentList from "../ItemEquipmentList";
import dynamic from "next/dynamic";
import AddEquipmentModal from "../modals/AddEquipmentModal";
import { MainCategoryContext } from "@/pages/items";
import { AccessTokenContext } from "@/context/access-token-context";
import SearchInput from "@/components/app/search-input";

const SerialNumberModal = dynamic(() => import("../modals/SerialNumberModal"));
const TypePlateQRCodeModal = dynamic(
  () => import("../modals/TypePlateQRCodeModal")
);
const QRCodeModal = dynamic(() => import("../modals/QRCodeModal"));

const ItemsData = () => {
  const router = useRouter();
  const page: any = router.query?.page || 1;
  const sub_category_id = router.query?.sub_category_id || "";
  const category_id = router.query?.category_id || "";
  const [dataToSelect, setDataToSelect] = useState<any[]>([]);
  const [openQrCodesModal, setOpenQrCodesModal] = useState<boolean>(false);
  const [openTypePlateQrCodesModal, setOpenTypePlateQrCodesModal] =
    useState<boolean>(false);
  const [qrCodeUris, setQrCodeUris] = useState<any[]>([]);
  const [loadingQrCodeButton, setLoadingQrCodeButton] = useState(false);
  const [loadingTypeplateButton, setLoadingTypeplateButton] = useState(false);
  const [selected__item_id, setSelected__item_id] = useState<any>(null);
  const [openSNModal, setOpenSNModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemData, setItemData] = useState<any>(undefined);
  const [itemIsLoading, setItemIsLoading] = useState<any>(false);
  const [itemError, setItemError] = useState<any>(null);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const { categories } = useContext(MainCategoryContext);
  const [search, setSearch] = useState(router.query?.search || "");

  let paramsObj: any = { page: String(page) };
  if (sub_category_id) paramsObj = { sub_category_id };
  if (category_id) paramsObj = { category_id };
  paramsObj.with_inventory = 1;

  if (search) paramsObj.search = search;

  let searchParams = new URLSearchParams(paramsObj);

  let { data, isLoading, error, mutate } = useSWR(
    `/api/item/category${
      category_id ? "/" + category_id : ""
    }?${searchParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  if (typeof window !== "undefined") {
    document.title = "Items | " + getSingleCategory();
  }

  function onPaginate(page: any) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page,
      },
    });
  }

  function onClickActionHeader(e: any, actionType: string) {
    if (actionType === "type-plate") printTypePlateOverview(e);
    if (actionType === "qr-code") printSelectedItemQRCodeOverview(e);
  }

  async function onClickAction(actionType: string, _item_id: string) {
    if (actionType === "qr-code") {
      const qrCodeData = await generateItemQrCode(_item_id);
      if (qrCodeData) {
        setQrCodeUris([qrCodeData]);
        setOpenQrCodesModal(true);
      }
    }
    if (actionType === "type-plate") {
      const qrCodeData = await generateItemQrCode(_item_id);
      if (qrCodeData) {
        setQrCodeUris([qrCodeData]);
        setOpenTypePlateQrCodesModal(true);
      }
    }

    if (actionType === "item-certification") {
      router.push("/items/item-certification/" + _item_id + "/equipment");
    }
  }

  const onSearch = (value: any) => {
    setSearch(value);
    router.push(`/items?search=${value || ""}`);
  };

  async function printTypePlateOverview(e: any) {
    const qrCodeValues: any[] = [];
    setLoadingTypeplateButton(true);
    for (
      let i = 0;
      i < dataToSelect.filter((item: any) => item.checked).length;
      i++
    ) {
      const qrCodeData = await generateItemQrCode(dataToSelect[i]._item_id);
      if (qrCodeData) qrCodeValues.push(qrCodeData);
    }
    setQrCodeUris(qrCodeValues);
    setLoadingTypeplateButton(false);
    setOpenTypePlateQrCodesModal(true);
  }

  async function printSelectedItemQRCodeOverview(e: any) {
    const qrCodeValues: any[] = [];
    setLoadingQrCodeButton(true);
    for (
      let i = 0;
      i < dataToSelect.filter((item: any) => item.checked).length;
      i++
    ) {
      const qrCodeData = await generateItemQrCode(dataToSelect[i]._item_id);
      if (qrCodeData) qrCodeValues.push(qrCodeData);
    }
    setLoadingQrCodeButton(false);
    setQrCodeUris(qrCodeValues);
    setOpenQrCodesModal(true);
  }

  function onViewOnPDF(type: string) {
    let doc: any;
    if (Array.isArray(qrCodeUris)) {
      if (type === "download:qr-code") {
        doc = itemQrCodeDraw(qrCodeUris);
        doc.save("Qr Codes.pdf");
        return;
      }
      if (type === "download:type-plate") {
        doc = itemTypePlate({ qrCodeDatas: qrCodeUris });
        doc.save("Type Plates.pdf");
        return;
      }

      if (type === "qr-code") {
        doc = itemQrCodeDraw(qrCodeUris);
      }
      if (type === "type-plate") {
        doc = itemTypePlate({ qrCodeDatas: qrCodeUris });
      }

      const pdfBlobUri: URL | any = doc.output("bloburl");
      window.open(pdfBlobUri);
    }
  }

  async function generateItemQrCode(_item_id: string, serial_number?: string) {
    const items = itemData ? itemData.items : [];
    const item = items.find((item: any) => item._item_id === _item_id);
    let itemSerialNumber = "";

    if (serial_number) itemSerialNumber = serial_number;
    else itemSerialNumber = itemNumber(item);

    const qrcodeUri = await generateQrCode(itemSerialNumber);

    return {
      uri: qrcodeUri,
      value: itemSerialNumber,
      text: item.item_name,
      item_construction_year: item.item_construction_year,
      item_power: item.item_power,
      item_pressure: item.item_pressure,
      item_tension: item.item_tension,
      item_kilowatt: item.item_kilowatt,
      item_rated_current: item.item_rated_current,
      item_protection_class: item.item_protection_class,
    };
  }

  function getSingleCategory() {
    if (categories && Array.isArray(categories)) {
      const category = categories.find(
        (item) => item._item_category_id === category_id
      );
      if (!category) return "All  Categories";
      return category.item_category_name;
    }
    return "All Categories";
  }

  function selectedItems(checked = true) {
    if (dataToSelect && dataToSelect.length > 0) {
      return dataToSelect.filter((item) => item.checked === checked);
    }
    return [];
  }

  function isCheckDataToSelect(_item_id: string) {
    const data_item = dataToSelect.find(
      (data_item: any) => data_item._item_id === _item_id && data_item.checked
    );
    return data_item ? true : false;
  }

  function onSelectSingleItem(isChecked: boolean, _item_id: string) {
    const _dataToSelect = [...dataToSelect];
    const dataToSelectIndex = _dataToSelect.findIndex(
      (data_item: any) => data_item._item_id === _item_id
    );
    _dataToSelect[dataToSelectIndex].checked = isChecked;
    setDataToSelect(_dataToSelect);
  }

  function onSelectAllItem(isChecked: boolean) {
    const _dataToSelect = [...dataToSelect].map((item: any) => ({
      ...item,
      checked: isChecked,
    }));
    setDataToSelect(_dataToSelect);
  }

  // useEffect(() => {
  //   (async () => {
  //     if (search) {
  //       let __data = { ...data };
  //       let ___isLoading = isLoading;
  //       let ___error = error;
  //       try {
  //         const index = client.initIndex("item_index");

  //         const hits = await index.search(search, {
  //           page: Number(page) - 1,
  //           hitsPerPage: PER_PAGE,
  //           attributesToHighlight: [
  //             "item_name",
  //             "item_number",
  //             "item_category_name",
  //             "item_sub_category_name",
  //             "_item_id",
  //           ],
  //         });

  //         if (hits && hits.hits) {
  //           __data["items"] = hits.hits;
  //           ___isLoading = false;
  //         }

  //         if (hits && hits.nbHits > PER_PAGE) {
  //           const res = await fetch(
  //             baseUrl + `/pager/links?page=${page}&total=${hits.nbHits}`
  //           );
  //           const links = await res.text();
  //           __data["pager"] = links;
  //         }
  //       } catch (err: any) {
  //         ___isLoading = false;
  //         ___error = err;
  //       }

  //       setItemData(__data);
  //       setItemIsLoading(___isLoading);
  //       setItemError(___error);
  //     }
  //   })();
  // }, [data, search, page, error, isLoading]);

  useEffect(() => {
    // if (!search) {
    setItemData(data);
    setItemIsLoading(isLoading);
    setItemError(error);
    // }
  }, [data, isLoading, error]);

  useEffect(() => {
    if (itemData && itemData.items && Array.isArray(itemData.items)) {
      const _dataItems = itemData.items
        ? itemData.items.map((item: any) => {
            return {
              _item_id: item._item_id,
              checked: false,
            };
          })
        : [];
      setDataToSelect(_dataItems);
    }
  }, [itemData]);

  return (
    <>
      {qrCodeUris.length > 0 && (
        <QRCodeModal
          open={openQrCodesModal}
          qrcodes={qrCodeUris}
          onOpenChange={setOpenQrCodesModal}
          onPrint={() => onViewOnPDF("qr-code")}
          onSaveAsPDF={() => onViewOnPDF("download:qr-code")}
        />
      )}

      {qrCodeUris.length > 0 && (
        <TypePlateQRCodeModal
          open={openTypePlateQrCodesModal}
          typePlates={qrCodeUris}
          onOpenChange={setOpenTypePlateQrCodesModal}
          onPrint={() => onViewOnPDF("type-plate")}
        />
      )}

      {selected__item_id && (
        <SerialNumberModal
          open={openSNModal}
          _item_id={selected__item_id}
          selectedItem={selectedItem}
          onOpenChange={setOpenSNModal}
        />
      )}

      <AddEquipmentModal
        onOpenChange={(open: any) => setOpenAddItemModal(open)}
        open={openAddItemModal}
        onSuccess={() => mutate(data)}
      />

      <div className="w-[calc(100%-400px)] h-full">
        <ScrollArea
          className="flex flex-col"
          viewPortClassName="min-h-[400px] rounded-xl shadow bg-white"
          viewPortStyle={{
            height: `calc(100vh - var(--header-height) - 40px)`,
          }}
        >
          <div
            className={cn(
              "flex w-full flex-col",
              "backdrop-blur-sm bg-white/90 z-10 sticky top-0 rounded-t-app"
            )}
          >
            <div
              className={cn(
                "p-3 flex justify-between items-center",
                "border-b border-b-stone-100"
              )}
            >
              <span className="text-lg font-medium">{getSingleCategory()}</span>
              <div className="flex items-center gap-2">
                <Button
                  className="rounded-xl"
                  onClick={() => setOpenAddItemModal(true)}
                >
                  Add Equipment
                </Button>
              </div>
            </div>

            <div className="px-3 py-2 ps-[8px] flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <SelectAll
                  onCheckedChange={(isChecked: any) =>
                    onSelectAllItem(isChecked)
                  }
                  checked={
                    dataToSelect.filter((item: any) => !item.checked).length ===
                    0
                  }
                  disabled={itemIsLoading && itemError}
                />
                {selectedItems().length > 0 &&
                  actionMenu.map((action, key) => (
                    <ActionButtonHeader
                      key={key}
                      name={action.name}
                      icon={action.icon}
                      loadingQrCodeButton={loadingQrCodeButton}
                      loadingTypeplateButton={loadingTypeplateButton}
                      actionType={action.actionType}
                      onClick={(e: any) =>
                        onClickActionHeader(e, action.actionType)
                      }
                    />
                  ))}
              </div>
              <SearchInput
                delay={1000}
                onChange={(e) => onSearch(e.target.value)}
                value={search}
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <TH className="ps-4 font-medium">Item Name</TH>
                <TH className="font-medium">Category</TH>
                <TH className="font-medium">Sub-category</TH>
                <TH className="pe-4 text-right font-medium">Actions</TH>
              </tr>
            </thead>
            <tbody>
              {itemData &&
                itemData.items &&
                itemData.items.map((item: any, key: number) => (
                  <tr key={key} className="group/item">
                    <ItemEquipmentList
                      _item_id={item._item_id}
                      item_name={item.item_name}
                      item_number={item.item_number}
                      item_sub_category_name={item.item_sub_category_name}
                      item_sub_category_index={item.item_sub_category_index}
                      with_serial={item.with_serial === "1"}
                      total_serial_numbers={
                        item.total_serial_numbers
                          ? parseInt(item.total_serial_numbers)
                          : 0
                      }
                      item_image={item.item_image}
                      current_quantity={item.current_quantity}
                      article_number={itemNumber(item)}
                      onClickAction={(actionType: string) =>
                        onClickAction(actionType, item._item_id)
                      }
                      onClickSerialButton={(_item_id: string) => {
                        setSelected__item_id(_item_id);
                        setOpenSNModal(true);
                        setSelectedItem(item);
                      }}
                      _highlightResult={item._highlightResult}
                      item_category_name={item.item_category_name}
                    >
                      <Checkbox
                        className={cn(
                          "bg-white/80 w-5 h-5 border-2 rounded-full invisible group-hover/item:visible",
                          "data-[state=checked]:visible"
                        )}
                        onCheckedChange={(isChecked: any) =>
                          onSelectSingleItem(isChecked, item._item_id)
                        }
                        checked={isCheckDataToSelect(item._item_id)}
                      />
                    </ItemEquipmentList>
                  </tr>
                ))}
              {itemData && itemData.items && itemData.items.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center">
                      <Image
                        src="/images/No data-rafiki.svg"
                        width={400}
                        height={400}
                        alt="No Data to Shown"
                      />
                    </div>
                  </td>
                </tr>
              )}
              {itemIsLoading &&
                [1, 2, 3, 4, 5, 6, 7].map((skele, key) => (
                  <tr key={key}>
                    <td colSpan={4}>
                      <div className="p-2 w-full">
                        <div className="flex gap-2">
                          <Skeleton className="h-[100px] w-[100px] rounded-md" />
                          <div className="flex flex-col gap-3 w-[400px]">
                            <Skeleton className="h-[20px] w-[300px] rounded-md" />
                            <Skeleton className="h-[20px] w-[200px] rounded-md" />
                            <Skeleton className="h-[15px] w-[80px] rounded-md" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {itemData && itemData.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={itemData.pager}
                onPaginate={onPaginate}
                currPage={page}
              />
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default memo(ItemsData);

export function itemNumber(item: any) {
  let iPrefix = item.with_prefix == 1 ? item.prefix + "." : "";
  let str = item.item_number;

  if (str >= 0 && str <= 999) {
    return iPrefix + str.padStart(3, 0);
  }

  return iPrefix + str;
}
