import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { generateQrCode, propertyOf } from "@/utils/itemQrCodeDraw";
import {
  Bookmark,
  Bus,
  Check,
  Circle,
  Loader2,
  Lock,
  Recycle,
  Ship,
  Wrench,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  ItemMenu,
  SelectAll,
  actionMenu,
  certificationActionButton,
  serialNumberAction,
} from ".";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Pagination from "../pagination";
import uniqid from "@/utils/text";
import { DialogProps } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { snStatuses } from "@/utils/snStatuses";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import onViewOnPDF from "@/utils/itemOnViewPDF";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import MoreOption from "../MoreOption";
import Status from "../status/status";
import QRCodeModal from "./modals/QRCodeModal";
import TypePlateQRCodeModal from "./modals/TypePlateQRCodeModal";
import ActionButtonHeader from "./ActionButtonHeader";

type SerialNumbersType = {
  _item_id?: string;
  selectedItem?: any;
  _warehouse_id?: string;
  additionalActionButton?: any;
};

export default function SerialNumbers(props: SerialNumbersType) {
  const {
    _item_id,
    selectedItem,
    _warehouse_id,
    additionalActionButton = [],
  } = props;
  const { data: session }: { data: any } = useSession();
  let token: any = null;
  const [tobeSelectedSerials, setTobeSelectedSerials] = useState<any[]>([]);
  const [loadingTypePlateButton, setLoadingTypePlateButton] = useState(false);
  const [loadingQrCodeButton, setLoadingQrCodeButton] = useState(false);
  const [page, setPage] = useState<any>(1);
  const [qrCodeValues, setQrCodeValues] = useState<any[]>([]);
  const [openQrCodesModal, setOpenQrCodesModal] = useState(false);
  const [openTypePlateQrCodesModal, setOpenTypePlateQrCodesModal] =
    useState(false);
  const selectAllId = uniqid();
  const [openManageStatusModal, setOpenManageStatusModal] = useState(false);
  const [selectedSN, setSelectedSN] = useState<any>(null);
  const router = useRouter();

  if (session && session.user && session.user.access_token) {
    token = session?.user.access_token;
  }

  const queryParams = new URLSearchParams({ page });

  if (_warehouse_id) {
    queryParams.set("_warehouse_id", _warehouse_id);
  }

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/items/${_item_id}/serial_numbers?${queryParams}`, token],
    fetchApi
  );

  const TH = ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => (
    <td
      className={cn(
        "border-b py-3 px-2 text-sm border-stone-200 font-medium bg-stone-200 text-stone-600",
        className
      )}
    >
      {children}
    </td>
  );

  const TD = ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => (
    <td
      className={cn(
        "border-b py-2 px-2 border-stone-100 group-last:border-0",
        className
      )}
    >
      {children}
    </td>
  );

  function onSelectAllItem(checked: boolean) {
    const _tobeSelectedSerials = [...tobeSelectedSerials].map((item: any) => ({
      ...item,
      checked,
    }));
    setTobeSelectedSerials(_tobeSelectedSerials);
  }

  function onSelectSingleItem(isChecked: boolean, _serial_number_id: string) {
    const _tobeSelectedSerials = [...tobeSelectedSerials];
    const dataToSelectIndex = _tobeSelectedSerials.findIndex(
      (sn: any) => sn._serial_number_id === _serial_number_id
    );
    _tobeSelectedSerials[dataToSelectIndex].checked = isChecked;
    setTobeSelectedSerials(_tobeSelectedSerials);
  }

  function isCheckDataToSelect(_serial_number_id: string) {
    const data_item = tobeSelectedSerials.find(
      (data_item: any) =>
        data_item._serial_number_id === _serial_number_id && data_item.checked
    );
    return data_item ? true : false;
  }

  function selectedItems(checked = true) {
    if (tobeSelectedSerials && tobeSelectedSerials.length > 0) {
      return tobeSelectedSerials.filter((item) => item.checked === checked);
    }
    return [];
  }

  async function onClickActionHeader(e: any, actionType: string) {
    const selectedSerials: any[] = selectedItems(true).map((item: any) => {
      return {
        value: item?.serial_number,
        text: selectedItem?.item_name,
        item_construction_year: selectedItem?.item_construction_year,
        item_power: selectedItem?.item_power,
        item_pressure: selectedItem?.item_pressure,
        item_tension: selectedItem?.item_tension,
        item_kilowatt: selectedItem?.item_kilowatt,
        item_rated_current: selectedItem?.item_rated_current,
        item_protection_class: selectedItem?.item_protection_class,
      };
    });

    if (actionType === "type-plate") {
      setLoadingTypePlateButton(true);
      for (let i = 0; i < selectedSerials.length; i++) {
        const qrcodeUri = await generateQrCode(selectedSerials[i].value);
        selectedSerials[i].uri = qrcodeUri;
      }
      setLoadingTypePlateButton(false);
      setOpenTypePlateQrCodesModal(true);
      setQrCodeValues(selectedSerials);
    }

    if (actionType === "qr-code") {
      setLoadingQrCodeButton(true);
      for (let i = 0; i < selectedSerials.length; i++) {
        const qrcodeUri = await generateQrCode(selectedSerials[i].value);
        selectedSerials[i].uri = qrcodeUri;
      }
      setLoadingQrCodeButton(false);
      setQrCodeValues(selectedSerials);
      setOpenQrCodesModal(true);
    }

    if (actionType === "po") {
      const doc = propertyOf(selectedSerials.map((sn) => sn.value));
      window.open(doc.output("bloburi"));
    }
  }

  async function onClickAction(sn: any, actionType: string) {
    if (actionType === "manage-status") {
      setOpenManageStatusModal(true);
      setSelectedSN(sn);
      return;
    }

    const qrcodeUri = await generateQrCode(sn.serial_number);
    const selectedSerials = {
      uri: qrcodeUri,
      value: sn?.serial_number,
      text: selectedItem?.item_name,
      item_construction_year: selectedItem?.item_construction_year,
      item_power: selectedItem?.item_power,
      item_pressure: selectedItem?.item_pressure,
      item_tension: selectedItem?.item_tension,
      item_kilowatt: selectedItem?.item_kilowatt,
      item_rated_current: selectedItem?.item_rated_current,
      item_protection_class: selectedItem?.item_protection_class,
    };

    if (actionType === "type-plate") {
      setQrCodeValues([selectedSerials]);
      setOpenTypePlateQrCodesModal(true);
    }

    if (actionType === "qr-code") {
      setQrCodeValues([selectedSerials]);
      setOpenQrCodesModal(true);
    }

    if (actionType === "po") {
      const doc = propertyOf([selectedSerials.value]);
      window.open(doc.output("bloburi"));
    }

    if (actionType === "item-certification") {
      router.push("/items/item-certification/" + sn._serial_number_id + "/sn");
    }
  }

  function TagButton({ _serial_number }: { _serial_number: any }) {
    const [loading, setLoading] = useState(false);

    let tagStatus = _serial_number?.serial_number_tag_status || 0;
    if (isNaN(tagStatus)) tagStatus = 0;
    tagStatus = parseInt(tagStatus);

    const onUpdateTag = async () => {
      try {
        setLoading(true);
        tagStatus = tagStatus === 1 ? 0 : 1;
        const res = await fetch(
          baseUrl +
            "/api/items/serial_number/" +
            _serial_number._serial_number_id,
          {
            method: "PUT",
            body: JSON.stringify({ serial_number_tag_status: tagStatus }),
            headers: { ...authHeaders(token) },
          }
        );
        const json = await res.json();

        if (json && json.success) {
          setLoading(false);
          const snIndex = data.serial_numbers.findIndex(
            (sn: any) =>
              sn._serial_number_id === _serial_number._serial_number_id
          );
          const _data = { ...data };
          _data.serial_numbers[snIndex].serial_number_tag_status = tagStatus;
          mutate(_data);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    return (
      <button
        className={cn("hover:bg-blue-50 p-2 rounded-xl")}
        disabled={loading}
        onClick={onUpdateTag}
      >
        {loading ? (
          <Loader2
            className="w-5 h-5 text-blue-300 animate-spin"
            strokeWidth={1}
          />
        ) : (
          <Bookmark
            className={cn(
              "w-5 h-5 text-blue-600",
              tagStatus === 1 && "fill-blue-600"
            )}
            strokeWidth={1}
          />
        )}
      </button>
    );
  }

  useEffect(() => {
    if (data && data.serial_numbers) {
      const _serial_numbers = data.serial_numbers.map(
        (item: any, key: number) => {
          return { checked: false, ...item };
        }
      );
      setTobeSelectedSerials(_serial_numbers);
    }
  }, [data]);

  return (
    <>
      {qrCodeValues.length > 0 && (
        <QRCodeModal
          open={openQrCodesModal}
          qrcodes={qrCodeValues}
          onOpenChange={setOpenQrCodesModal}
          onPrint={() => onViewOnPDF("qr-code", qrCodeValues)}
          onSaveAsPDF={() => onViewOnPDF("download:qr-code", qrCodeValues)}
        />
      )}

      {qrCodeValues.length > 0 && (
        <TypePlateQRCodeModal
          open={openTypePlateQrCodesModal}
          typePlates={qrCodeValues}
          onOpenChange={setOpenTypePlateQrCodesModal}
          onPrint={() => onViewOnPDF("type-plate", qrCodeValues)}
        />
      )}

      {selectedSN && (
        <ManageSnStatusModal
          open={openManageStatusModal}
          onOpenChange={setOpenManageStatusModal}
          selectedSerialNumber={selectedSN}
          onUpdated={(status) => {
            const snIndex = data.serial_numbers.findIndex(
              (sn: any) =>
                sn.serial_number_status === selectedSN.serial_number_status
            );
            const _data = { ...data };
            if (snIndex > -1) {
              _data.serial_numbers[snIndex].serial_number_tag_status = status;
              mutate(_data);
              setOpenManageStatusModal(false);
            }
          }}
        />
      )}

      <div className="flex ps-1 bg-red-10 py-2 gap-1 justify-between pe-3">
        <div className="flex items-center gap-1">
          <SelectAll
            className="border-2 h-5 w-5 rounded-full mr-2"
            onCheckedChange={(isChecked: any) => onSelectAllItem(isChecked)}
            checked={
              tobeSelectedSerials.filter((item: any) => !item.checked)
                .length === 0
            }
            disabled={isLoading && error}
            id={selectAllId}
          />
          {selectedItems().length > 0 &&
            [...actionMenu, ...serialNumberAction].map((action, key) => (
              <ActionButtonHeader
                key={key}
                name={action.name}
                icon={action.icon}
                actionType={action.actionType}
                onClick={(e: any) => onClickActionHeader(e, action.actionType)}
                loadingTypeplateButton={loadingTypePlateButton}
                loadingQrCodeButton={loadingQrCodeButton}
              />
            ))}
        </div>
        <form id="Search" className="max-w-[300px] w-full">
          <Input
            type="search"
            placeholder="Search"
            className="placeholder:text-stone-400"
          />
        </form>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <TH className="ps-9">Serial No.</TH>
            <TH>Status</TH>
            <TH>Location</TH>
            <TH>Year</TH>
            <TH className="text-center">Tagged</TH>
            <TH className="text-right pe-4">Actions</TH>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td className="py-3 px-2" colSpan={6}>
                <div className="flex flex-col gap-4">
                  <Skeleton className="w-[300px] h-[15px]" />
                  <Skeleton className="w-[200px] h-[15px]" />
                </div>
              </td>
            </tr>
          )}
          {data &&
            data.serial_numbers &&
            data.serial_numbers.map((sn: any, key: number) => (
              <tr key={key} className="group hover:bg-stone-100">
                <TD className="ps-3">
                  <div className="flex items-center">
                    <Checkbox
                      className={cn(
                        "bg-white/80 w-5 h-5 border-2 rounded-full mr-2 invisible group-hover:visible",
                        "data-[state=checked]:visible"
                      )}
                      onCheckedChange={(isChecked: any) =>
                        onSelectSingleItem(isChecked, sn._serial_number_id)
                      }
                      checked={isCheckDataToSelect(sn._serial_number_id)}
                    />
                    <span className="font-bold">{sn.serial_number}</span>
                  </div>
                </TD>
                <TD>
                  <Status
                    statusName={sn.serial_number_status}
                    className={cn(
                      "flex gap-1 py-1 px-2 items-center rounded-md w-fit"
                    )}
                    statusClassName="text-sm font-medium"
                    iconProps={{
                      width: 15,
                      height: 15,
                    }}
                  />
                </TD>
                <TD>{sn.warehouse_country}</TD>
                <TD>{sn.item_construction_year || "--"}</TD>
                <TD className="text-center">
                  <TagButton _serial_number={sn} />
                </TD>
                <TD className="text-right pe-4">
                  <MoreOption>
                    {[
                      ...actionMenu,
                      ...serialNumberAction,
                      ...certificationActionButton,
                      ...additionalActionButton,
                    ].map((action, key) => (
                      <ItemMenu
                        key={key}
                        onClick={(e: any) =>
                          onClickAction(sn, action.actionType)
                        }
                      >
                        {action.icon}
                        <span className="font-medium">{action.name}</span>
                      </ItemMenu>
                    ))}
                  </MoreOption>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>
      {data && data.pager && (
        <div className="mt-auto w-full border border-stone-100">
          <Pagination
            pager={data.pager}
            onPaginate={(page: number) => setPage(page)}
            currPage={page}
          />
        </div>
      )}
    </>
  );
}

interface ManageSnStatusModalType extends DialogProps {
  selectedSerialNumber?: any;
  onUpdated?: (sn_status: any) => void;
}

export const ManageSnStatusModal = (props: ManageSnStatusModalType) => {
  const { open, onOpenChange, selectedSerialNumber, onUpdated } = props;
  const [currentStatus, setCurrentStatus] = useState(
    selectedSerialNumber && selectedSerialNumber.serial_number_status
  );
  const { data: session }: { data: any } = useSession();
  let token: any = null;
  const [loading, setLoading] = useState(false);

  if (session && session.user && session.user.access_token) {
    token = session?.user.access_token;
  }

  const onClickDone = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        baseUrl +
          "/api/items/serial_number/" +
          selectedSerialNumber._serial_number_id,
        {
          method: "PUT",
          body: JSON.stringify({ serial_number_status: currentStatus }),
          headers: { ...authHeaders(token) },
        }
      );
      const json = await res.json();
      if (json && json.success) {
        setLoading(false);
        setTimeout(() => {
          onUpdated && onUpdated(currentStatus);
        }, 300);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange && onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-[500px] p-0 gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white">
          <DialogTitle>Manage Status</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1 rounded-full hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <div className="bg-stone-100 py-3 px-4 flex items-center justify-between">
          <span className="font-medium">
            {selectedSerialNumber && selectedSerialNumber.serial_number}
          </span>
          <Status
            statusName={currentStatus}
            className={cn("flex gap-1 py-1 px-2 items-center rounded-md w-fit")}
            statusClassName="text-sm font-medium"
            iconProps={{
              width: 15,
              height: 15,
            }}
          />
        </div>
        <div className="p-3">
          <RadioGroup
            className="flex flex-wrap w-full gap-0"
            value={currentStatus}
            onValueChange={(value) => setCurrentStatus(value)}
          >
            {snStatuses.map((status: any, key: number) => (
              <div className="w-[50%] p-1" key={key}>
                <label
                  className={cn(
                    "cursor-pointer w-full flex gap-2 items-center p-3",
                    "rounded-xl border border-stone-100 hover:bg-stone-100",
                    currentStatus === status.name && "bg-stone-100"
                  )}
                  htmlFor={status.name}
                >
                  <RadioGroupItem
                    value={status.name}
                    id={status.name}
                    className="border-blue-400 data-[state=checked]:text-blue-400"
                  />
                  <span>{status.text}</span>
                </label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-3">
            <Button
              className="w-full py-2 h-auto rounded-xl"
              onClick={onClickDone}
              disabled={loading}
            >
              {loading ? "Loading..." : "Done"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
