
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { memo, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronDown, FileDown, FileText, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "..";
import onViewOnPDF from "@/utils/itemOnViewPDF";
import { ScrollArea } from "@/components/ui/scroll-area";

type TypePlateQRCodeModalType = { 
  open: boolean, 
  typePlates?: any[],
  onOpenChange?: (open: boolean) => void, 
  onPrint?: () => void, 
  // onSaveAsPDF?: () => void
};

const TypePlateQRCodeModal = ({ 
  open,
  onOpenChange, 
  onPrint, 
  typePlates, 
  // onSaveAsPDF 
}: TypePlateQRCodeModalType) => {
 const [headerEl, setHeaderEl] = useState<any>(null);
 const [footerEl, setFooterEl] = useState<any>(null);
 const [contentEl, setContentEl] = useState<any>(null);
 const [scrollHeight, setScrollHeight] = useState(0);

  const title = () => {
    if (typePlates && typePlates.length > 1) return 'TypePlates';
    return 'TypePlate';
  }

  useEffect(() => {
    const onResize = () => {
      if (contentEl && headerEl && footerEl) {
        const { height: contentHeight } = contentEl.getBoundingClientRect();
        const { height: headerHeight } = headerEl.getBoundingClientRect();
        const { height: footerHeight } = footerEl.getBoundingClientRect();
        setScrollHeight(contentHeight - (headerHeight + footerHeight));
      }
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [headerEl, footerEl, contentEl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0" ref={el => setContentEl(el)}>
        <div ref={el => setHeaderEl(el)} className="sticky top-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center bg-white border-b border-b-stone-100">
            <DialogTitle>{title()}</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
        </div>
        <ScrollArea viewPortStyle={{ height: scrollHeight > 0 ? scrollHeight : undefined }}>
          <div className="p-4 flex flex-wrap gap-2 justify-center">
            {typePlates && typePlates.map((qrcode, key) => (
              <div key={key} className="w-[48%] bg-stone-100 p-3 rounded-md">
                <div className="flex">
                  <div className="flex flex-col items-start">
                    <Image 
                      src="/images/tp_header_new.png"
                      alt="Black Hotwork Logo"
                      className="object-contain mb-2"
                      height={50}
                      width={300}
                    />
                    <span className="font-medium text-[12px]">Romanshornerstr 123 | 9322 Egnach | Switzerland</span>
                    <span className="font-medium text-[12px]">+41 (0) 71 649 20 90 | contact@hotwork.ag</span>
                  </div>
                  <Image 
                    src="/images/tp_ce.png"
                    className="h-[50px] object-contain ms-2"
                    alt="TP CE"
                    height={50}
                    width={70}
                  />
                </div>
                <p className="mt-3 font-bold">{qrcode.text}</p>
                <div className="flex mt-3">
                  <div className="w-[35%]">
                    <Image 
                      src={qrcode.uri} 
                      className="w-full"
                      height={100}
                      width={100}
                      alt="QR Code"
                    />
                  </div>
                  <div className="flex flex-col text-[12px] font-medium ms-3">
                    <p>Serial Number: {qrcode.value || ''}</p>
                    <p>Year: {qrcode.item_construction_year || ''}</p>
                    <p>Capacity: {qrcode.item_power || ''}</p>
                    <p>Pressure: {qrcode.item_pressure || ''}</p>
                    <p>Voltage: {qrcode.item_tension || ''}</p>
                    <p>Motor kW: {qrcode.item_kilowatt || ''}</p>
                    <p>Rated Current: {qrcode.item_rated_current || ''}</p>
                    <p>Protection: {qrcode.item_protection_class || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="sticky bottom-0" ref={el => setFooterEl(el)}>
          <DialogFooter className="bg-white border-t border-t-stone-100">
            <div className="flex items-center justify-end p-2 gap-2">
              <Button className="flex gap-2 items-center"
                onClick={onPrint}
                variant={'secondary'}
              >
                <FileText width={18} height={18} className="text-violet-400" /> View As PDF
              </Button>
              <Button className="flex gap-2 items-center"
                onClick={() => onViewOnPDF('download:type-plate:pdf', typePlates)}
                variant={'secondary'}
              >
                <FileDown width={18} height={18} className="text-red-400" /> Save as PDF
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(TypePlateQRCodeModal);