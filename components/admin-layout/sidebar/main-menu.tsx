import {
  Home,
  Layers,
  ListChecks,
  FileText,
  LineChart,
  ShieldAlert,
  Cog,
  Folders,
  Landmark,
  FolderKanban,
  FolderDot,
  FolderCheck,
  BaggageClaim,
  ScrollText,
  WalletCards,
  ListOrdered,
  Warehouse,
  Users2,
  HardHat,
  FileSignature,
  ListPlus,
  Truck,
  Shirt,
  CalendarCheck,
  CircleDollarSign,
  SearchCheck,
  Award,
  Building2,
  CalendarX,
  UserCog,
  Edit2,
  Contact,
  Key,
  Users,
  Pen,
  Info,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavItem from "./nav-item";
import { generalSettingsMenu } from "./general-settings/general-settings-menu";
import { cmsSettingsMenu } from "./cms-settings-menu";
import { documentSettingsMenu } from "./document-settings-menu";
import { projectSettingsMenu } from "./project-settings-menu";
import { invoiceSettingsMenu } from "./invoice-settings-menu";
import { loadingSettingsMenu } from "./loading-settings-menu";
import { notificationSettingsMenu } from "./notification-settings-menu";
import { userSettings } from "./user-settings";

export default function MainMenu() {
  const pathName = usePathname();

  const iconProps = {
    width: 20,
    height: 20,
    strokeWidth: 2,
  };

  const menus = [
    {
      name: "Dashboard",
      icon: <Home {...iconProps} />,
      href: "/",
    },
    {
      name: "Projects",
      icon: <FolderKanban {...iconProps} />,
      href: "/projects",
      subs: [
        {
          name: "Overview",
          icon: <Info {...iconProps} />,
          href: "/projects",
        },
        {
          name: "Offers",
          icon: <FolderDot {...iconProps} />,
          href: "/projects/offers",
        },
        {
          name: "Order Confirmations",
          icon: <FolderCheck {...iconProps} />,
          href: "/projects/order-confirmation",
        },
        {
          name: "Delivery Notes",
          icon: <BaggageClaim {...iconProps} />,
          href: "/projects/delivery-note",
        },
        {
          name: "Invoices",
          icon: <ScrollText {...iconProps} />,
          href: "/projects/invoices",
        },
        {
          name: "Credit Notes",
          icon: <WalletCards {...iconProps} />,
          href: "/projects/credit-note",
        },
        // {
        //   name: "Project Summary",
        //   icon: <Edit2 {...iconProps} />,
        //   href: "/projects/project-summary",
        // },
        {
          name: "Loading List",
          icon: <ListPlus {...iconProps} />,
          href: "/projects/loading-list",
        },
        {
          name: "Shipping List",
          icon: <Truck {...iconProps} />,
          href: "/projects/shipping-list",
        },
      ],
    },
    {
      name: "Address Manager",
      icon: <Contact {...iconProps} />,
      href: "/address-manager",
    },
    {
      name: "Documents",
      icon: <Folders {...iconProps} />,
      href: "/documents",
      subs: [
        // {
        //   name: "Overview",
        //   icon: <Info {...iconProps} />,
        //   href: "/documents",
        // },
        {
          name: "Company",
          icon: <Landmark {...iconProps} />,
          href: "/documents/company?parent_id=0",
        },
        {
          name: "Employees",
          icon: <Users2 {...iconProps} />,
          href: "/documents/employees",
        },
        {
          name: "Equipments",
          icon: <HardHat {...iconProps} />,
          href: "/documents/equipment",
        },
      ],
    },
    {
      name: "Items",
      icon: <Layers {...iconProps} />,
      href: "/items",
      subs: [
        // {
        //   name: "Overview",
        //   icon: <Info {...iconProps} />,
        //   href: "/items",
        // },
        // {
        //   name: "PPE Manager",
        //   icon: <Shirt {...iconProps} />,
        //   href: "/items/ppe-manager",
        // },
        // {
        //   name: "Set",
        //   icon: <FileSignature {...iconProps} />,
        //   href: "/items/set",
        // },
      ],
    },
    {
      name: "Purchase Order",
      icon: <ListChecks {...iconProps} />,
      href: "/purchase-order",
    },
    // {
    //   name: "Reporting",
    //   icon: <FileText {...iconProps} />,
    //   href: "/reporting",
    //   subs: [
    //     {
    //       name: "Overview",
    //       icon: <Info {...iconProps} />,
    //       href: "/reporting",
    //     },
    //     {
    //       name: "Working Hours",
    //       icon: <CalendarCheck {...iconProps} />,
    //       href: "/reporting/working-hours",
    //     },
    //     {
    //       name: "Expenses",
    //       icon: <CircleDollarSign {...iconProps} />,
    //       href: "/reporting/expenses",
    //     },
    //     {
    //       name: "Daily Activity Reports",
    //       icon: <SearchCheck {...iconProps} />,
    //       href: "/reporting/daily-activity-reports",
    //     },
    //     {
    //       name: "Item Certification",
    //       icon: <Award {...iconProps} />,
    //       href: "/reporting/item-certification",
    //     },
    //     {
    //       name: "Project Reports",
    //       icon: <ListOrdered {...iconProps} />,
    //       href: "/reporting/projects",
    //     },
    //   ],
    // },
    // {
    //   name: "Temperature Curve",
    //   icon: <LineChart {...iconProps} />,
    //   href: "/temperature-curve",
    // },
    {
      name: "Admin",
      icon: <ShieldAlert {...iconProps} />,
      href: "/admin",
      subs: [
        // {
        //   name: "Overview",
        //   icon: <Info {...iconProps} />,
        //   href: "/reporting",
        // },
        {
          name: "Users",
          icon: <Users {...iconProps} />,
          href: "/admin/users",
        },
        {
          name: "Company",
          icon: <Building2 {...iconProps} />,
          href: "/admin/company",
          subs: [
            {
              name: "Overview",
              icon: <Info {...iconProps} />,
              href: "/admin/company",
            },
            {
              name: "Automated Letters",
              icon: <FileText {...iconProps} />,
              href: "/admin/companyletters",
            },
            {
              name: "Letter Signatories",
              icon: <Pen {...iconProps} />,
              href: "/admin/companyletters/create",
            },
            {
              name: "Letter Categories",
              icon: <FileText {...iconProps} />,
              href: "/admin/companyletters/letter-category",
            },
          ],
        },
        {
          name: "Warehouse",
          icon: <Warehouse {...iconProps} />,
          href: "/admin/warehouse",
        },
        {
          name: "Leave",
          icon: <CalendarX {...iconProps} />,
          href: "/admin/leave",
        },
        // {
        //   name: "Hotware Updates",
        //   icon: <UserCog {...iconProps} />,
        //   href: "/admin/hotware-updates",
        // },
      ],
    },
    {
      name: "Settings",
      icon: <Cog {...iconProps} />,
      href: "/settings",
      subs: [
        ...generalSettingsMenu,
        ...cmsSettingsMenu,
        ...documentSettingsMenu,
        ...projectSettingsMenu,
        ...invoiceSettingsMenu,
        ...userSettings,
        ...loadingSettingsMenu,
        ...notificationSettingsMenu,
        {
          name: "Items",
          icon: <Layers {...iconProps} />,
          subs: [
            {
              name: "Main Categories",
              icon: (
                <svg
                  width={iconProps.width}
                  height={iconProps.height}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              href: "/settings/items/main-category",
            },
            {
              name: "Categories",
              icon: (
                <svg
                  width={iconProps.width}
                  height={iconProps.height}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              href: "/settings/items/category",
            },
            {
              name: "Subcategories",
              icon: (
                <svg
                  width={iconProps.width}
                  height={iconProps.height}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={iconProps.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              href: "/settings/items/subcategory",
            },
          ],
        },
        {
          name: "User Roles",
          icon: <Key {...iconProps} />,
          href: "/settings/roles",
        },
      ],
    },
    // {
    //   name: "Documents (Personal)",
    //   icon: (
    //     <svg
    //       width={iconProps.width}
    //       height={iconProps.height}
    //       viewBox='0 0 24 24'
    //       fill='none'
    //       xmlns='http://www.w3.org/2000/svg'
    //     >
    //       <path
    //         d='M4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V7'
    //         stroke='currentColor'
    //         strokeWidth={iconProps.strokeWidth}
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //       />
    //       <path
    //         d='M14 2V8H20'
    //         stroke='currentColor'
    //         strokeWidth='2'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //       />
    //       <path
    //         d='M6.5 15C7.88071 15 9 13.8807 9 12.5C9 11.1193 7.88071 10 6.5 10C5.11929 10 4 11.1193 4 12.5C4 13.8807 5.11929 15 6.5 15Z'
    //         stroke='currentColor'
    //         strokeWidth='1.5'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //       />
    //       <path
    //         d='M11 19C11 17.9391 10.5786 16.9217 9.82843 16.1716C9.07828 15.4214 8.06087 15 7 15C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19'
    //         stroke='currentColor'
    //         strokeWidth='1.5'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //       />
    //     </svg>
    //   ),
    //   href: "/documents-personal",
    // },
  ];

  return (
    <ul className="flex flex-col gap-1">
      {menus.map((item, key) => (
        <NavItem
          key={key}
          leftIcon={item.icon}
          href={item.href}
          active={pathName === item.href}
          title={item.name}
          subs={item.subs}
        />
      ))}
    </ul>
  );
}
