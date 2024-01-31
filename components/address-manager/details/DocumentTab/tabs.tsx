import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContainerSizeContext } from "@/pages/address-manager/[cms_id]";
import {
  FileBarChart,
  ListOrdered,
  MailCheck,
  PackageCheck,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import { useContext } from "react";

type TabContent = {
  renderUploads?: React.ReactNode;
  renderOffer?: React.ReactNode;
  renderOrderConfirmation?: React.ReactNode;
  renderDeliveryNote?: React.ReactNode;
  renderPurchaseOrder?: React.ReactNode;
  renderInvoices?: React.ReactNode;
};

export const TabContent = ({
  renderUploads,
  renderOffer,
  renderOrderConfirmation,
  renderDeliveryNote,
  renderPurchaseOrder,
  renderInvoices,
}: TabContent) => {
  const containerSize: any = useContext(ContainerSizeContext);

  return (
    <Tabs defaultValue="uploads" className="flex" orientation="vertical">
      <div className="top-[10px] sticky backdrop-blur rounded-xl h-fit z-20">
        <TabsList className="w-full justify-start rounded-none bg-transparent flex-col h-full items-start p-0">
          <TabsTriggerButton
            name="Uploads"
            value="uploads"
            icon={
              <UploadCloud
                strokeWidth={1}
                className="w-[20px] text-stone-800"
              />
            }
          />
          <TabsTriggerButton
            name="Offers"
            value="offers"
            icon={
              <FileBarChart
                strokeWidth={1}
                className="w-[20px] text-stone-800"
              />
            }
          />
          <TabsTriggerButton
            name="Order Confirmations"
            value="order-confirmation"
            icon={
              <PackageCheck
                strokeWidth={1}
                className="w-[20px] text-stone-800"
              />
            }
          />
          <TabsTriggerButton
            name="Delivery Note"
            value="delivery-note"
            icon={
              <MailCheck strokeWidth={1} className="w-[20px] text-stone-800" />
            }
          />
          <TabsTriggerButton
            name="Purchase Orders"
            value="purchase-order"
            icon={
              <WalletCards
                strokeWidth={1}
                className="w-[20px] text-stone-800"
              />
            }
          />
          <TabsTriggerButton
            name="Invoices"
            value="invoices"
            icon={
              <ListOrdered
                strokeWidth={1}
                className="w-[20px] text-stone-800"
              />
            }
          />
        </TabsList>
      </div>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="uploads">
        <div className="border w-full rounded-xl">{renderUploads}</div>
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="offers">
        <div className="border w-full rounded-xl">{renderOffer}</div>
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="order-confirmation">
        <div className="border w-full rounded-xl">
          {renderOrderConfirmation}
        </div>
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="delivery-note">
        <div className="border w-full rounded-xl">{renderDeliveryNote}</div>
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="purchase-order">
        <div className="border w-full rounded-xl">{renderPurchaseOrder}</div>
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pb-6 w-full" value="invoices">
        <div className="border w-full rounded-xl">{renderInvoices}</div>
      </TabsContent>
    </Tabs>
  );
};

const TabsTriggerButton = ({
  name,
  value,
  icon,
}: {
  name: string;
  value: string;
  icon: React.ReactNode;
}) => {
  const containerSize: any = useContext(ContainerSizeContext);

  return (
    <TabsTrigger
      className="flex gap-3 hover:bg-stone-100 data-[state=active]:bg-stone-200 data-[state=active]:shadow-none w-full justify-start rounded-xl"
      value={value}
    >
      {icon} {containerSize?.width > 1000 ? name : ""}
    </TabsTrigger>
  );
};
