import QrCode from "@/components/icons/qr-code";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { memo, useContext, useEffect, useState } from "react";
import { AddPopOverMenu } from "../../ShippingDetails/AddButtonPopover";
import dynamic from "next/dynamic";
import ScannedMatch from "./ScannedMatch";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { Html5Qrcode } from "html5-qrcode";

export const ShippingItemContext = React.createContext(null);
export const InvalidQrCodeContext = React.createContext(false);

const Scanner = dynamic(() => import("./Scanner"));

const QrCodeScanner = (props: QrCodeScannerProps) => {
  const [openScanner, setOpenScanner] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const _shipping_id = shippingDetails ? shippingDetails._shipping_id : null;
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [errorScan, setErrorScan] = useState(false);
  const [openScannedItem, setOpenScannedItem] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const onScanSucceed = async (decodedText: any) => {
    if (!decodedText) return;
    setInvalid(false);

    try {
      setErrorScan(false);
      const res = await fetch(
        "/api/shipping/" + _shipping_id + "/item/scan_qrcode",
        {
          method: "POST",
          body: JSON.stringify({ qrcode_value: decodedText }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setScannedItem(json.shipping_item);
        setOpenScannedItem(true);
        setOpenScanner(false);
      }

      if (!json.success) {
        setScannedItem(null);
        setOpenScannedItem(true);
        setOpenScanner(false);

        if (!json.valid) {
          setInvalid(true);
        }
      }
    } catch (err: any) {
      setErrorScan(true);
    }
  };

  const onclickUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg, .jpeg, .png";
    input.capture = "";
    input.click();

    setOpenScanner(false);

    input.onchange = async (e: any) => {
      if (e.target.files.length === 0) return;
      const imageFile = e.target.files[0];
      let html5QrCode = new Html5Qrcode("reader_id_for_upload");

      html5QrCode
        .scanFile(imageFile, false)
        .then((decodedText) => {
          onScanSucceed(decodedText);
          // html5QrCode.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  useEffect(() => {
    return () => {
      setScannedItem(null);
      setOpenScannedItem(false);
      setOpenScanner(false);
    };
  }, []);

  return (
    <>
      <ShippingItemContext.Provider value={scannedItem}>
        <InvalidQrCodeContext.Provider value={invalid}>
          <ScannedMatch
            open={openScannedItem}
            onOpenChange={(open: any) => {
              setOpenScannedItem(open);
            }}
            onScanAgain={(scan: any) => {
              setOpenScanner(scan);
              setOpenScannedItem(false);
            }}
            onClickEdit={props.onClickEditItem}
          />
          <Scanner
            open={openScanner}
            onOpenChange={(open: any) => setOpenScanner(open)}
            onSuccessScan={(decodedResult: any) => {
              onScanSucceed(decodedResult.decodedText);
            }}
            onClickUploadQrCode={onclickUpload}
            onErrorScan={(err) => console.log(err)}
          />
        </InvalidQrCodeContext.Provider>
      </ShippingItemContext.Provider>
      <div id="reader_id_for_upload" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"red"}
            className="shadow-2xl py-2.5 px-4 font-medium flex gap-2 items-center"
          >
            <QrCode className="fill-white" /> Add by QR code
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-stone-100 py-2 px-0 w-auto">
          {/* <div id="reader_id_for_upload" /> */}
          <div className="flex flex-col">
            {/* <AddPopOverMenu
              title="Scan QR Code"
              onClick={() => setOpenScanner(true)}
            /> */}
            <AddPopOverMenu title="Upload QR Code" onClick={onclickUpload} />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default memo(QrCodeScanner);

type QrCodeScannerProps = {
  onClickEditItem?: (shipping_item_id?: any) => void;
};
