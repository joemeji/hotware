import {
  User,
  File,
  FlagTriangleLeft,
  Type,
  BarChart3,
  ShoppingCart,
  FileStack,
} from "lucide-react";

export const iconProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
};

export const documentSettingsMenu = [
  {
    name: "Document",
    icon: <File {...iconProps} />,
    subs: [
      {
        name: "Language",
        icon: <FlagTriangleLeft {...iconProps} />,
        href: "/settings/document/language",
      },
      {
        name: "Text Block",
        icon: <Type {...iconProps} />,
        href: "/settings/document/text-block",
      },
      {
        name: "Risk Management",
        icon: <BarChart3 {...iconProps} />,
        href: "/settings/document/risk-management",
      },
      {
        name: "Exclusive VAT",
        icon: <ShoppingCart {...iconProps} />,
        href: "/settings/document/exclusive-vat",
      },
      {
        name: "Categories",
        icon: <FileStack {...iconProps} />,
        href: "/settings/document/categories",
      },
    ],
  },
];
