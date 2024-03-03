import {
    BellDot,
    Gauge,
    Layers,
    LucideListStart,
    PercentIcon,
    Receipt,
    ShieldCheck,
    ShoppingBag,
    TrendingDown,
    TruckIcon,
    TypeIcon,
		UserCheck,
  } from "lucide-react";
  
  export const iconProps = {
    width: 20,
    height: 20,
    strokeWidth: 2,
  };
  
  export const notificationSettingsMenu = [
    {
      name: "Notification",
      icon: <BellDot {...iconProps} />,
      subs: [
        {
          name: "Administrative Reminder",
          icon: <ShieldCheck {...iconProps} />,
          href: "/settings/notification/administrative-reminder",
        },
        {
          name: "Purchase Order",
          icon: <ShoppingBag {...iconProps} />,
          href: "/settings/notification/purchase-order",
        },
        {
					name: "Due Invoices",
					icon: <Receipt {...iconProps} />,
					href: "/settings/notification/due-invoice",
        },
        {
					name: "Leave",
					icon: <Gauge {...iconProps} />,
					href: "/settings/notification/leave-reminder",
        },
				{
					name: "Item Status",
					icon: <TrendingDown {...iconProps} />,
					href: "/settings/notification/item-status",
        },
				{
					name: "Item Stock Limit",
					icon: <PercentIcon {...iconProps} />,
					href: "/settings/notification/item-stock",
        },
				{
					name: "Project Role Documents",
					icon: <Layers {...iconProps} />,
					href: "/settings/notification/technician-document",
        },
				{
					name: "Skill Evaluation",
					icon: <UserCheck {...iconProps} />,
					href: "/settings/notification/skill-evaluation",
        },
      ],
    },
  ];
  