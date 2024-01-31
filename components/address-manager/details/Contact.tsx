import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { TabContent } from "./tabs";
import DetailsTab from "./DetailsTab";
import { memo, useContext, useRef } from "react";
import VatDetailsTab from "./VatDetailsTab";
import ContactPersonTab from "./ContactPersonTab";
import DocumentTab from "./DocumentTab";
import RequirementsTab from "./RequirementsTab";
import FurtherInfoTab from "./FurtherInfoTab";
import { useRouter } from "next/router";
import {
  ContactContainerSizeContext,
  ContainerSizeContext,
} from "@/pages/address-manager/[cms_id]";

const Contact = ({ onViewDetails }: { onViewDetails?: () => void }) => {
  const router = useRouter();
  const contactSize = useContext(ContactContainerSizeContext);
  const headerRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const containerSize: any = useContext(ContainerSizeContext);

  return (
    <div
      className="bg-white min-h-[calc(100vh-var(--header-height)-40px)] rounded-app"
      ref={cardRef}
    >
      <div className="flex justify-between items-center pe-3 border-b">
        <div className="flex items-center p-2 " ref={headerRef}>
          <Button
            className={cn("p-2.5 rounded-full")}
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="text-stone-500" />
          </Button>
          <span className="font-medium text-lg">Contact Details</span>
        </div>
        {containerSize?.width < 1000 && (
          <Button className="py-1.5" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </div>

      <ScrollArea
        viewPortStyle={{
          height:
            cardRef.current?.offsetHeight -
            headerRef.current?.offsetHeight -
            1 +
            "px",
        }}
        // className="pe-3"
      >
        <TabContent
          renderDetails={<DetailsTab />}
          renderVatDetails={<VatDetailsTab />}
          renderContactPersons={<ContactPersonTab />}
          renderDocuments={<DocumentTab />}
          renderRequirements={<RequirementsTab />}
          renderFurtherInfo={<FurtherInfoTab />}
        />
      </ScrollArea>
    </div>
  );
};

export default memo(Contact);
