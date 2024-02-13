import {
  Briefcase,
  Cog,
  CogIcon,
  DollarSign,
  Flag,
  Home,
  Receipt,
  StickyNote,
  Truck,
} from "lucide-react";

export const iconProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
};

export const generalSettingsMenu = [
  {
    name: "General",
    icon: <Cog {...iconProps} />,
    subs: [
      {
        name: "General",
        icon: <CogIcon {...iconProps} />,
        href: "/settings/general",
      },
      {
        name: "Currency",
        icon: <DollarSign {...iconProps} />,
        href: "/settings/general/currency",
      },
      {
        name: "Country",
        icon: <Flag {...iconProps} />,
        href: "/settings/general/country",
      },
      {
        name: "Holiday",
        icon: <Home {...iconProps} />,
        href: "/settings/general/holiday",
      },
      {
        name: "Value Added Tax (VAT)",
        icon: <Receipt {...iconProps} />,
        href: "/settings/general/vat",
      },
      {
        name: "Payment Terms",
        icon: <StickyNote {...iconProps} />,
        href: "/settings/general/payment-terms",
      },
      {
        name: "Shipping Method",
        icon: <Truck {...iconProps} />,
        href: "/settings/general/shipping-method",
      },
      {
        name: "Modules",
        icon: <Briefcase {...iconProps} />,
        href: "/settings/general/modules",
      },
    ],
  },
];
