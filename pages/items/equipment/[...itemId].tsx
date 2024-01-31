'use client';

import AdminLayout from "@/components/admin-layout";
import { actionMenu, certificationActionButton } from "@/components/items";
import { ItemTabs } from "@/components/items/itemId";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { Plus } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { faker } from '@faker-js/faker';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { generateQrCode } from "@/utils/itemQrCodeDraw";
import onViewOnPDF from "@/utils/itemOnViewPDF";
import { SerialNumberTab } from "@/components/items/itemId/SerialNumberTab";
import { DetailsTab } from "@/components/items/itemId/DetailsTab";
import { UnitsTab } from "@/components/items/itemId/UnitsTab";
import { CodificationTab } from "@/components/items/itemId/CodificationTab";
import PricesTab from "@/components/items/itemId/PriceTab";
import { useRouter } from "next/navigation";
import DocumentTab from "@/components/items/itemId/DocumentTab";
import QRCodeModal from "@/components/items/modals/QRCodeModal";
import TypePlateQRCodeModal from "@/components/items/modals/TypePlateQRCodeModal";
import ActionButtonHeader from "@/components/items/ActionButtonHeader";

export default function ItemId({ _item_id, _item_id_path, access_token, currencies }: any) {
  const [loadingTypePlateButton, setLoadingTypePlateButton] = useState(false);
  const [loadingQrCodeButton, setLoadingQrCodeButton] = useState(false);
  const [openTypePlateQrCodesModal, setOpenTypePlateQrCodesModal] = useState(false);
  const [openQrCodesModal, setOpenQrCodesModal] = useState(false);
  const [qrCodeValues, setQrCodeValues] = useState<any[]>([]);
  const router = useRouter();

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/items/${_item_id}/equipment`, access_token], 
    fetchApi
  );

  if (typeof window !== 'undefined') {
    document.title = data ? data.item_name : '';
  }

  const onClickActionHeader = async (actionType: string) => {
    const itemData: any = {
      value: data && data.item_sub_category_index + data.item_number,
      text: data?.item_name,
      item_construction_year: data?.item_construction_year,
      item_power: data?.item_power,
      item_pressure: data?.item_pressure,
      item_tension: data?.item_tension,
      item_kilowatt: data?.item_kilowatt,
      item_rated_current: data?.item_rated_current,
      item_protection_class: data?.item_protection_class
    };

    if (actionType === 'type-plate') {
      setLoadingTypePlateButton(true);
      const qrcodeUri = await generateQrCode(itemData.value);
      itemData.uri = qrcodeUri;
      setLoadingTypePlateButton(false);
      setOpenTypePlateQrCodesModal(true);
      setQrCodeValues([itemData]);
    }

    if (actionType === 'qr-code') {
      setLoadingQrCodeButton(true);
      const qrcodeUri = await generateQrCode(itemData.value);
      itemData.uri = qrcodeUri;
      setLoadingQrCodeButton(false);
      setQrCodeValues([itemData]);
      setOpenQrCodesModal(true);
    }

    if (actionType === 'item-certification') {
      router.push('/items/item-certification/' + _item_id + '/equipment');
    }
  };

  return (
    <AdminLayout>
      {qrCodeValues.length > 0 && (
        <QRCodeModal
          open={openQrCodesModal}
          qrcodes={qrCodeValues}
          onOpenChange={setOpenQrCodesModal}
          onPrint={() => onViewOnPDF('qr-code', qrCodeValues)}
          onSaveAsPDF={() => onViewOnPDF('download:qr-code', qrCodeValues)}
        />
      )}
      {qrCodeValues.length > 0 && (
        <TypePlateQRCodeModal
          open={openTypePlateQrCodesModal}
          typePlates={qrCodeValues}
          onOpenChange={setOpenTypePlateQrCodesModal}
          onPrint={() => onViewOnPDF('type-plate', qrCodeValues)}
        />
      )}
      <div className="w-full max-w-[1600px] mx-auto flex gap-4 min-h-[calc(100vh-var(--header-height))] px-[25px] relative">
        <div className="w-[70%]">
          <div className="px-5  rounded-xl flex flex-col gap-2 pb-4 h-full">
            <div className="py-4 pb-2 flex justify-between items-start">
              <div>
                <h1 className="font-bold text-xl mb-1">{data && data.item_name}</h1>
                <p className="text-stone-600 text-lg font-medium">
                {data && data.item_sub_category_index + data.item_number}
                </p>
              </div>
              <div className="flex">
                {[...actionMenu, ...certificationActionButton].map((action: any, key: number) => (
                  <ActionButtonHeader 
                    key={key}
                    icon={action.icon}
                    name={action.name}
                    onClick={() => onClickActionHeader(action.actionType)}
                    loadingTypeplateButton={loadingTypePlateButton}
                    loadingQrCodeButton={loadingQrCodeButton}
                  />
                ))}
              </div>
            </div>

            <div className="flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 sticky top-[calc(var(--header-height)+4px)] z-10">
              <ItemTabs />
            </div>
            
            <div className="rounded-xl">
                {_item_id_path === 'details' && (
                  <DetailsTab 
                    _item_id={_item_id} 
                    equipment={data}
                    onUpdated={(_data: any) => mutate({ ...data, ..._data })}
                  />
                )}
                {_item_id_path === 'units' && (
                  <UnitsTab 
                    _item_id={_item_id} 
                    equipment={data}
                    onUpdated={(_data: any) => mutate({ ...data, ..._data })}
                  />
                )}
                {_item_id_path === 'codifications' && (
                  <CodificationTab 
                    _item_id={_item_id}
                    equipment={data} 
                    onUpdated={(_data: any) => mutate({ ...data, ..._data })}
                  />
                )}
                {_item_id_path === 'prices' && (
                  <PricesTab 
                    _item_id={_item_id} 
                    equipment={data}
                    currencies={currencies}
                    access_token={access_token}
                  />
                )}
                {_item_id_path === 'documents' && (
                  <DocumentTab 
                    _item_id={_item_id} 
                    access_token={access_token}
                  />
                )}
                {_item_id_path === 'serial-numbers' && (
                  <SerialNumberTab 
                    _item_id={_item_id} 
                    equipment={data}
                    access_token={access_token}
                  />
                )}
            </div>
          </div>
        </div>
        <div 
          className={cn(
            "w-[30%] bg-white max-h-full top-[calc(var(--header-height)+20px)] sticky",
            "h-[calc(100vh-var(--header-height)-40px)] rounded-xl overflow-hidden shadow-sm"
          )}
        >
          <ScrollArea className="h-[calc(100vh-var(--header-height)-40px)]">
            <div className="flex justify-between items-start sticky top-0 backdrop-blur bg-white/30 p-4 rounded-b-xl">
              <div>
                <h1 className="font-medium text-lg mb-1">Images</h1>
              </div>
              <div className="flex">
                <button className="bg-stone-200 p-2 rounded-xl hover:bg-stone-300">
                  <Plus className="text-stone-600" />
                </button>
              </div>
            </div>
            <div className="flex flex-col rounded-t-xl overflow-hidden p-3 gap-3">
              {[0,0,0,0,0,0,0].map((img: any, key: number) => {
                return (
                  <Image 
                    key={key}
                    src={faker.image.urlPicsumPhotos({ width: 400, height: 400 })} 
                    alt="Test Alt" 
                    className="w-full"
                    width={400}
                    height={400}
                  />
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );
  const itemId = context.query.itemId;
  let token  = null;
  let _item_id = null;
  let _item_id_path = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  if (itemId && itemId[0]) {
    _item_id = itemId[0];
  }

  if (itemId && itemId[1]) {
    _item_id_path = itemId[1];
  }

  const headers = { Authorization: 'Bearer ' + token };

  let res = await fetch(baseUrl + '/currencies');
  const currencies = await res.json();

  return {
    props: {
      _item_id,
      _item_id_path,
      access_token: token,
      headers,
      currencies,
    },
  }
}