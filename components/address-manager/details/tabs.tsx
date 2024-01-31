import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactContainerSizeContext } from "@/pages/address-manager/[cms_id]";
import { Contact, Files, Info, List, Wallet2 } from "lucide-react";
import { useContext } from "react";

type TabContent = {
  renderDetails?: React.ReactNode;
  renderVatDetails?: React.ReactNode;
  renderFurtherInfo?: React.ReactNode;
  renderContactPersons?: React.ReactNode;
  renderRequirements?: React.ReactNode;
  renderDocuments?: React.ReactNode;
};

export const TabContent = ({
  renderContactPersons,
  renderDetails,
  renderDocuments,
  renderFurtherInfo,
  renderRequirements,
  renderVatDetails,
}: TabContent) => {
  const contactSize: any = useContext(ContactContainerSizeContext);

  console.log(contactSize);

  return (
    <Tabs defaultValue="details">
      <div
        className="px-3 py-2 top-0 sticky backdrop-blur z-10 overflow-x-auto pe-3"
        style={{ width: `${contactSize?.width}px` }}
      >
        <TabsList className="w-full justify-start rounded-none bg-transparent">
          <TabsTriggerButton
            name="Details"
            value="details"
            icon={<Info strokeWidth={1} className="w-[18px] text-blue-500" />}
          />
          <TabsTriggerButton
            name="VAT Details"
            value="vat-details"
            icon={
              <Wallet2 strokeWidth={1} className="w-[18px] text-purple-500" />
            }
          />
          <TabsTriggerButton
            name="Further Info"
            value="further-info"
            icon={<Info strokeWidth={1} className="w-[18px] text-red-500" />}
          />
          <TabsTriggerButton
            name="Contact Persons"
            value="contact-person"
            icon={
              <Contact strokeWidth={1} className="w-[18px] text-yellow-500" />
            }
          />
          <TabsTriggerButton
            name="Requirements"
            value="requirements"
            icon={<List strokeWidth={1} className="w-[18px] text-cyan-500" />}
          />
          <TabsTriggerButton
            name="Documents"
            value="documents"
            icon={
              <Files strokeWidth={1} className="w-[18px] text-orange-500" />
            }
          />
        </TabsList>
      </div>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="details">
        {renderDetails}
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="vat-details">
        {renderVatDetails}
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="further-info">
        {renderFurtherInfo}
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="contact-person">
        {renderContactPersons}
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="requirements">
        {renderRequirements}
      </TabsContent>
      <TabsContent className="mt-0 ps-4 pe-2 pt-3 pb-6" value="documents">
        {renderDocuments}
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
  return (
    <TabsTrigger
      className="flex gap-2 hover:bg-stone-100 data-[state=active]:bg-stone-200 data-[state=active]:shadow-none"
      value={value}
    >
      {icon} {name}
    </TabsTrigger>
  );
};
