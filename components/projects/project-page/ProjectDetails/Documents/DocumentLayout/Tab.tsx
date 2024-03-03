import {
  BaggageClaim,
  BookOpen,
  ChevronLeft,
  FolderCheck,
  FolderDot,
  ScrollText,
  Truck,
  WalletCards,
} from "lucide-react";
import TabItem from "./TabItem";
import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";

const Tab = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-white shadow rounded-xl py-2">
      <div className="flex items-center justify-between pe-2">
        {/* <p className="font-medium px-3 opacity-80">Links</p>
        <button className="hover:bg-stone-100 p-1 rounded-full">
          <ChevronLeft />
        </button> */}
      </div>
      <ul className="flex flex-col w-full">
        <TabItem
          icon={<FolderDot className="text-lime-600 w-[18px]" />}
          label={"Offer"}
          href="/offer"
          active={router.asPath.includes("/documents/offer")}
        />
        <TabItem
          icon={<FolderCheck className="text-red-600 w-[18px]" />}
          label={"Order Confirmation"}
          href="/order_confirmation"
          active={router.asPath.includes("/documents/order_confirmation")}
        />
        <TabItem
          icon={<BaggageClaim className="text-purple-600 w-[18px]" />}
          label={"Delivery Notes"}
          href="/delivery_note"
          active={router.asPath.includes("/documents/delivery_note")}
        />
        <TabItem
          icon={<ScrollText className="text-teal-600 w-[18px]" />}
          label={"Invoices"}
          href="/invoice"
          active={router.asPath.includes("/documents/invoice")}
        />
        <TabItem
          icon={<WalletCards className="text-orange-600 w-[18px]" />}
          label={"Credit Notes"}
          href="/credit_note"
          active={router.asPath.includes("/documents/credit_note")}
        />
        <TabItem
          icon={<Truck className="text-rose-600 w-[18px]" />}
          label={"Shipping"}
          href="/shipping"
          active={router.asPath.includes("/documents/shipping")}
        />
        <Separator className="my-2" />
        <TabItem
          icon={<BookOpen className="text-blue-600 w-[18px]" />}
          label={"Auto-Generated Documentation"}
          href="/auto_document"
          active={router.asPath.includes("/documents/auto_document")}
        />
        <TabItem
          icon={<BookOpen className="text-green-600 w-[18px]" />}
          label={"Risk Management"}
          href="/risk_management"
          active={router.asPath.includes("/documents/risk_management")}
        />
        <TabItem
          icon={<BookOpen className="text-pink-600 w-[18px]" />}
          label={"Manual Documents"}
          href="/manual_document"
          active={router.asPath.includes("/documents/manual_document")}
        />
      </ul>
    </div>
  );
};

export default Tab;
