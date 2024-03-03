import {
    LucideListStart,
    TruckIcon,
    TypeIcon,
  } from "lucide-react";
  
  export const iconProps = {
    width: 20,
    height: 20,
    strokeWidth: 2,
  };
  
  export const loadingSettingsMenu = [
    {
      name: "Loading List",
      icon: <LucideListStart {...iconProps} />,
      subs: [
        {
          name: "Type",
          icon: <TypeIcon {...iconProps} />,
          href: "/settings/loading/type",
        },
        {
          name: "Work",
          icon: <TruckIcon {...iconProps} />,
          href: "/settings/loading/work",
        },
      ],
    },
  ];
  