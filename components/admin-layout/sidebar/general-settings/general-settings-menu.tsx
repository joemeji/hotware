import { Layers, ListPlus, Files, FileStack, Cog, CogIcon, Currency, DollarSign, Flag } from "lucide-react";

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
        icon: <Flag  {...iconProps} />,
        href: "/settings/general/country",
      },
    ],
  },
];
