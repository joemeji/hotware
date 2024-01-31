import itemQrCodeDraw, { itemTypePlate } from "./itemQrCodeDraw";

export default function onViewOnPDF(type: string, qrCodeValues: any) {
  let doc : any;
  if (Array.isArray(qrCodeValues)) {

    if (type === 'download:qr-code') {
      doc = itemQrCodeDraw(qrCodeValues);
      doc.save('Qr Codes.pdf');
      return;
    }

    if (type === 'download:type-plate:pdf') {
      doc = itemTypePlate({ qrCodeDatas: qrCodeValues });
      doc.save('Type Plates.pdf');
      return;
    }

    if (type === 'qr-code') {
      doc = itemQrCodeDraw(qrCodeValues);
    }
    if (type === 'type-plate') {
      doc = itemTypePlate({ qrCodeDatas: qrCodeValues });
    }

    const pdfBlobUri: URL | any = doc.output('bloburl');
    window.open(pdfBlobUri);
  }
}