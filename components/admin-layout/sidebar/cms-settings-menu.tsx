import { Briefcase, Building, Landmark, ListPlus, User } from "lucide-react";

export const iconProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
};

export const cmsSettingsMenu = [
  {
    name: "CMS",
    icon: <User {...iconProps} />,
    subs: [
      {
        name: "Industry",
        icon: <Landmark {...iconProps} />,
        href: "/settings/cms/industry",
      },
      {
        name: "Department",
        icon: <Building {...iconProps} />,
        href: "/settings/cms/department",
      },
      {
        name: "Position",
        icon: <User {...iconProps} />,
        href: "/settings/cms/position",
      },
      {
        name: "Company Addresses",
        icon: <Briefcase {...iconProps} />,
        href: "/settings/cms/company-addresses",
      },
      {
        name: "Requirement Level",
        icon: <ListPlus {...iconProps} />,
        href: "/settings/cms/requirement-level",
      },
    ],
  },
];
