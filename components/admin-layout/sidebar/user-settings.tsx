import {
  Briefcase,
  Building,
  Combine,
  Landmark,
  ListPlus,
  User,
} from "lucide-react";

export const iconProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
};

export const userSettings = [
  {
    name: "User",
    icon: <User {...iconProps} />,
    subs: [
      {
        name: "Services",
        icon: <Combine {...iconProps} />,
        href: "/settings/user/service",
      },
    ],
  },
];
