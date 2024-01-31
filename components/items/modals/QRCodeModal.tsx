import { memo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../../ui/button";
import { ChevronDown, FileText, X } from "lucide-react";
import { FileDown } from "lucide-react";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import dataURLtoFile, { dataURLmimeType } from "@/utils/dataURLtoFile";
import mime from 'mime-types';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ScrollArea } from "@/components/ui/scroll-area";

const QRCodeModal = (
  { 
    open, 
    onOpenChange, 
    onPrint, 
    onSaveAsPDF, 
    qrcodes,
  }: 
  { 
    onOpenChange: (open: boolean) => void, 
    open: boolean, 
    onPrint?: () => void, 
    onSaveAsPDF?: () => void, 
    qrcodes?: any[],
  }
  ) => {
    const [headerEl, setHeaderEl] = useState<any>(null);
    const [footerEl, setFooterEl] = useState<any>(null);
    const [contentEl, setContentEl] = useState<any>(null);
    const [scrollHeight, setScrollHeight] = useState(0);

  const title = () => {
    if (qrcodes && qrcodes.length > 1) return 'QR Codes';
    return 'QR Code';
  }

  const onSaveAsPicture = async () => {
    const zip = new JSZip();
    let zipFilename = 'qrcodes.zip';

    if (qrcodes && qrcodes?.length === 1) {
      const a = document.createElement('a');
      const mimeType: any = dataURLmimeType(qrcodes[0].uri);
      const ext = mime.extension(mimeType);
      const filename = `${qrcodes[0].text}__${qrcodes[0].value}.${ext}`;

      a.download = filename;
      a.href = qrcodes[0].uri;
      a.click();

      return;
    }

    qrcodes?.forEach(async (qrcode: any) => {
      const mimeType: any = dataURLmimeType(qrcode.uri);
      const ext = mime.extension(mimeType);
      const filename = `${qrcode.text}__${qrcode.value}.${ext}`;
      const base64 = qrcode.uri ? qrcode.uri.split(',')[1] : null;

      zipFilename = qrcode.text + '_qrcodes.zip';

      if (base64) zip.file(filename, base64, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });

    saveAs(content, zipFilename);
  };

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
        <div className="sticky top-0" ref={el => setHeaderEl(el)}>
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center bg-white border-b border-b-stone-100">
            <DialogTitle>{title()}</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
        </div>
        <ScrollArea viewPortStyle={{ height: scrollHeight > 0 ? scrollHeight : undefined }}>
          <div className="p-4 flex flex-wrap gap-2 justify-center">
            {qrcodes && qrcodes.map((qr: any, key: number) => (
              <div 
                className={cn(
                  "flex flex-col rounde overflow-hidden items-center bg-stone-100/100 rounded-md gap-2",
                  "w-[49%]"
                )}
                key={key}
              >
                <div className="py-2 px-3 w-full mb-auto text-sm font-medium text-center border-b border-b-stone-200 text-stone-800">
                  <p>{qr.text}</p>
                </div>
                <Image 
                  src={qr.uri}
                  alt="QRCODE"
                  width={150}
                  height={150}
                />
                <div className="py-2 px-3 w-full mt-auto text-sm font-medium text-center border-t border-t-stone-200 text-stone-800">
                  <span>{qr.value}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="sticky bottom-0" ref={el => setFooterEl(el)}>
          <DialogFooter className="bg-white border-t border-t-stone-100">
            <div className="flex items-center justify-end p-2 gap-2">
              <Button className="flex gap-2 items-center"
                variant='secondary'
                onClick={onPrint}
              >
                <FileText width={18} height={18} className="text-violet-400" /> View As PDF
              </Button>
              <MoreOption 
                menuTriggerChildren={(
                  <Button variant={'secondary'} className="flex items-center gap-1 ">
                    Save as
                    <ChevronDown width={20} height={20} />
                  </Button>
                )}
              >
                <ItemMenu onClick={onSaveAsPicture}>
                  <span className="font-medium">Save as Picture</span>
                </ItemMenu>
                <ItemMenu onClick={onSaveAsPDF}>
                  <span className="font-medium">Save as PDF</span>
                </ItemMenu>
              </MoreOption>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(QRCodeModal);