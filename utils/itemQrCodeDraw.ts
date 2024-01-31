import jsPDF from "jspdf";
import qrcode from 'qrcode';

export default function itemQrCodeDraw(qrCodeDatas: any[]) {
  const doc = new jsPDF('l', 'mm', [76.2, 50.8]);
  const width = doc.internal.pageSize.getWidth();

  const mainWidth = (width / 2) - 4;

  qrCodeDatas.forEach((data: any, index: number) => {
    let x = 2;
    let y= 4;
    let fontSize = 10;

    doc.addImage(data.uri, 'jpg', x, y, mainWidth + 1, mainWidth + 1);
    doc.setFontSize(fontSize);
    doc.text(data.value, x, mainWidth + y + 5);
    
    fontSize = 6;
    x += 2;
    doc.addImage(data.uri, 'jpg', mainWidth + x, y, mainWidth / 2, mainWidth / 2);
    doc.setFontSize(fontSize);
    doc.text(data.value, mainWidth + x, (mainWidth / 2) + y + 3);
  
    x += 2;
    doc.addImage(data.uri, 'jpg', (mainWidth + x) + (mainWidth / 2), y, mainWidth / 2, mainWidth / 2);
    doc.setFontSize(fontSize);
    doc.text(data.value, (mainWidth + x) + (mainWidth / 2), (mainWidth / 2) + y + 3);
  
    y += (mainWidth / 2) + 5;
    x = 4;
    doc.addImage(data.uri, 'jpg', mainWidth + x, y, mainWidth / 2, mainWidth / 2);
    doc.setFontSize(fontSize);
    doc.text(data.value, mainWidth + x, y + 3 + (mainWidth / 2));
  
    x += 2;
    doc.addImage(data.uri, 'jpg', mainWidth + (mainWidth / 2) + x, y, mainWidth / 2, mainWidth / 2);
    doc.setFontSize(fontSize);
    doc.text(data.value, mainWidth + (mainWidth / 2) + x, y + 3 + (mainWidth / 2));

    if (qrCodeDatas.length - 1 !== index) {
      doc.addPage();
    }
  });

  return doc;
}

export function itemTypePlate({
  size = [76.2, 50.8], 
  qrCodeDatas = []
}: {
  size?: any[],
  qrCodeDatas: any[]
}) {
  const doc = new jsPDF('l', 'mm', size);
  const width = doc.internal.pageSize.getWidth();

  qrCodeDatas.forEach((qrcode, index) => {
    let x = 4;
    let y = 4;
    let headerWidth = width - 25;
    let headerHeight = 4;
    doc.addImage('/images/tp_header_new.png', x, y, headerWidth, headerHeight);
    let ceWidth = headerWidth + x + 3;
    doc.addImage('/images/tp_ce.PNG', ceWidth, y, 13, 9);

    doc.setFontSize(6);

    let addressHeight = headerHeight + y + 3;
    doc.text('Romanshornerstr 123 | 9322 Egnach | Switzerland', x, addressHeight);

    addressHeight += 3;
    doc.text('+41 (0) 71 649 20 90 | contact@hotwork.ag', x, addressHeight);

    addressHeight += 2;
    doc.line(x, addressHeight - 1, width - x, addressHeight - 1);

    addressHeight += 3;
    doc.setFont('', 'bold');
    doc.text(qrcode.text, x, addressHeight);

    let qrWidth = width / 3;
    addressHeight += 2; 
    doc.addImage(qrcode.uri, x - 1, addressHeight, qrWidth, qrWidth);

    x = qrWidth + x + 3;
    y = addressHeight + 3;
    doc.setFont('', 'normal');
    doc.text('Serial Number: ' + qrcode.value || '', x, y);

    y += 3;
    doc.text('Year: ' + qrcode.item_construction_year || '', x, y);

    y += 3;
    doc.text('Capacity: '  + qrcode.item_power || '', x, y);

    y += 3;
    doc.text('Pressure: ' + qrcode.item_pressure || '', x, y);

    y += 3;
    doc.text('Voltage: ' + qrcode.item_tension || '', x, y);

    y += 3;
    doc.text('Motor kW: ' + qrcode.item_kilowatt || '', x, y);

    y += 3;
    doc.text('Rated Current: ' + qrcode.item_rated_current || '', x, y);

    y += 3;
    doc.text('Protection: ' + qrcode.item_protection_class || '', x, y);

    if (qrCodeDatas.length - 1 !== index) {
      doc.addPage();
    }
  });
  
  return doc;
}

export function propertyOf(serial_numbers: any[]) {
  const doc = new jsPDF('l', 'mm', [76.2, 50.8]);
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  serial_numbers.forEach((serial_number, index) => {
    let poHeight = 45;
    let x = 3;
    let y = 2;
    doc.addImage('/images/property_of_holding.png', x, y, width - (y * 2), poHeight);

    y = 25;
    doc.setFontSize(8);
    doc.text('SERIAL NUMBER:', x, y);

    y += 6;
    x += 10;
    doc.setFont('', 'bold');
    doc.setFontSize(12);
    doc.text(serial_number, x, y);

    let ny = height - 2;

    x += width / 2;
    doc.setFont('', 'normal');
    doc.setFontSize(7);
    doc.text('www.hotwork.ag', x, ny);

    let iconHeight = 2.5;
    doc.addImage('/images/email.png', x - 3, ny - 2, iconHeight, iconHeight);

    ny -= 4;
    doc.setFontSize(7);
    doc.text('+41 (0) 71 649 20 99', x, ny);
    doc.addImage('/images/printer.jpeg', x - 3, (ny - iconHeight) + 0.3, iconHeight, iconHeight);

    ny -= 4;
    doc.setFontSize(7);
    doc.text('+41 (0) 71 649 20 96', x, ny);
    doc.addImage('/images/phone.jpg', x - 3, (ny - iconHeight) + 0.3, iconHeight, iconHeight);

    y = height - 2;
    doc.text('Switzerland', height - 5, y, { align: 'right' });

    y -= 4;
    doc.text('9322 Egnach,TG', height - 5, y, { align: 'right' });

    y -= 4;
    doc.text('Romanshornerstr. 123', height - 5, y, { align: 'right' });

    y -= 4;
    doc.line(x - 4, height - 2, x - 4, 38);

    if (serial_numbers.length - 1 !== index) {
      doc.addPage();
    }
  });

  return doc;
}

export async function generateQrCode(data: string, width?: number) {
  return await qrcode.toDataURL(data, {
    width: width || 300,
    margin: 2
  });
}