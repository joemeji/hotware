import { memo } from "react";
import { TabContent } from "./tabs";
import UploadTab from "./UploadTab";
import OfferTab from "./OfferTab";
import OCTab from "./OCTab";
import DeliveryNoteTab from "./DeliveryNoteTab";
import PurchaseOrderTab from "./PurchaseOrderTab";
import InvoiceTab from "./InvoiceTab";

const DocumentTab = () => {
  return (
    <TabContent
      renderUploads={<UploadTab />}
      renderOffer={<OfferTab />}
      renderOrderConfirmation={<OCTab />}
      renderDeliveryNote={<DeliveryNoteTab />}
      renderPurchaseOrder={<PurchaseOrderTab />}
      renderInvoices={<InvoiceTab />}
    />
  );
};

export default memo(DocumentTab);
