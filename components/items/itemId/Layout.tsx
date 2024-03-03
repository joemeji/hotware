"use client";

import AdminLayout from "@/components/admin-layout";
import { actionMenu, certificationActionButton } from "@/components/items";
import { ItemTabs } from "@/components/items/itemId";
import { fetchApi } from "@/utils/api.config";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";
import { generateQrCode } from "@/utils/itemQrCodeDraw";
import onViewOnPDF from "@/utils/itemOnViewPDF";
import { useRouter as useNavRouter } from "next/navigation";
import QRCodeModal from "@/components/items/modals/QRCodeModal";
import TypePlateQRCodeModal from "@/components/items/modals/TypePlateQRCodeModal";
import ActionButtonHeader from "@/components/items/ActionButtonHeader";
import { itemNumber } from "@/components/items/ItemsData";
// import Image from "@/components/items/itemId/Image";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";

export const EquipmentContext = createContext(null);

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [loadingTypePlateButton, setLoadingTypePlateButton] = useState(false);
  const [loadingQrCodeButton, setLoadingQrCodeButton] = useState(false);
  const [openTypePlateQrCodesModal, setOpenTypePlateQrCodesModal] =
    useState(false);
  const [openQrCodesModal, setOpenQrCodesModal] = useState(false);
  const [qrCodeValues, setQrCodeValues] = useState<any[]>([]);
  const navRouter = useNavRouter();
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/items/${router.query.item_id}/equipment`, access_token],
    fetchApi
  );

  if (typeof window !== "undefined") {
    document.title = data ? data.item_name : "";
  }

  const onClickActionHeader = async (actionType: string) => {
    const itemData: any = {
      value: itemNumber(data),
      text: data?.item_name,
      item_construction_year: data?.item_construction_year,
      item_power: data?.item_power,
      item_pressure: data?.item_pressure,
      item_tension: data?.item_tension,
      item_kilowatt: data?.item_kilowatt,
      item_rated_current: data?.item_rated_current,
      item_protection_class: data?.item_protection_class,
    };

    if (actionType === "type-plate") {
      setLoadingTypePlateButton(true);
      const qrcodeUri = await generateQrCode(itemData.value);
      itemData.uri = qrcodeUri;
      setLoadingTypePlateButton(false);
      setOpenTypePlateQrCodesModal(true);
      setQrCodeValues([itemData]);
    }

    if (actionType === "qr-code") {
      setLoadingQrCodeButton(true);
      const qrcodeUri = await generateQrCode(itemData.value);
      itemData.uri = qrcodeUri;
      setLoadingQrCodeButton(false);
      setQrCodeValues([itemData]);
      setOpenQrCodesModal(true);
    }

    if (actionType === "item-certification") {
      navRouter.push(
        "/items/item-certification/" + router.query.item_id + "/equipment"
      );
    }
  };

  return (
    <AdminLayout>
      <EquipmentContext.Provider value={data}>
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
        <div className="w-full max-w-[1600px] mx-auto gap-4 flex flex-col min-h-[calc(100vh-var(--header-height))] p-[25px] relative">
          <div className="bg-[url(/images/wave-bg.jpg)] rounded-xl relative z-0 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-stone-100/70 after:z-[-1] shadow p-3 gap-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-bold text-xl">{data && data.item_name}</h1>
                <p className="opacity-80 text-base">
                  {data && itemNumber(data)}
                </p>
              </div>
            </div>
            <div className="flex gap-1 z-10 justify-between">
              <div className="flex gap-1">
                <ItemTabs />
              </div>
              <div className="flex gap-1">
                {[...actionMenu, ...certificationActionButton].map(
                  (action: any, key: number) => (
                    <ActionButtonHeader
                      key={key}
                      icon={action.icon}
                      name={action.name}
                      onClick={() => onClickActionHeader(action.actionType)}
                      loadingTypeplateButton={loadingTypePlateButton}
                      loadingQrCodeButton={loadingQrCodeButton}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-[70%]">
              <div className="flex flex-col gap-2 pb-4 h-full">
                {children}
                {/* <div className="rounded-xl">
                    {_item_id_path === "details" && (
                      <DetailsTab
                        _item_id={_item_id}
                        onUpdated={(_data: any) =>
                          mutate({ ...data, ..._data })
                        }
                      />
                    )}
                    {_item_id_path === "units" && (
                      <UnitsTab
                        _item_id={_item_id}
                        onUpdated={(_data: any) =>
                          mutate({ ...data, ..._data })
                        }
                      />
                    )}
                    {_item_id_path === "codifications" && (
                      <CodificationTab
                        _item_id={_item_id}
                        onUpdated={(_data: any) =>
                          mutate({ ...data, ..._data })
                        }
                      />
                    )}
                    {_item_id_path === "prices" && (
                      <PricesTab
                        _item_id={_item_id}
                        currencies={currencies}
                        access_token={access_token}
                      />
                    )}
                    {_item_id_path === "documents" && (
                      <DocumentTab
                        _item_id={_item_id}
                        access_token={access_token}
                      />
                    )}
                    {_item_id_path === "serial-numbers" && (
                      <SerialNumberTab
                        _item_id={_item_id}
                        access_token={access_token}
                      />
                    )}
                  </div> */}
              </div>
            </div>
            <div
              className={cn(
                "w-[30%] bg-white",
                "h-[calc(100vh-var(--header-height))] rounded-xl overflow-hidden shadow-sm"
              )}
            >
              {/* <Image alt="" /> */}
            </div>
          </div>
        </div>
      </EquipmentContext.Provider>
    </AdminLayout>
  );
}
