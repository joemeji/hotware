import {
  Briefcase,
  Building,
  Landmark,
  ListChecksIcon,
  ListEndIcon,
  ListPlus,
  User,
} from "lucide-react";

export const iconProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
};

export const projectSettingsMenu = [
  {
    name: "Project",
    icon: <ListChecksIcon {...iconProps} />,
    subs: [
      {
        name: "Project Role",
        icon: <User {...iconProps} />,
        href: "/settings/project/project-role",
      },
      {
        name: "Task",
        icon: <ListEndIcon {...iconProps} />,
        href: "/settings/project/task",
      },
    ],
  },
];
