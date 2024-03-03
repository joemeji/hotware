import {
    Coins,
    Euro,
    FileSymlink,
    FileText,
    Ticket,
  } from "lucide-react";
  
  export const iconProps = {
    width: 20,
    height: 20,
    strokeWidth: 2,
  };
  
  export const invoiceSettingsMenu = [
    {
      name: "Invoice",
      icon: <FileText {...iconProps} />,
      subs: [
        {
          name: "Bank Account",
          icon: <Euro {...iconProps} />,
          href: "/settings/invoice/bank-account",
        },
        {
          name: "Account Titles",
          icon: <Ticket {...iconProps} />,
          href: "/settings/invoice/account-title",
        },
        {
          name: "Value Added Tax (VAT)",
          icon: <Coins {...iconProps} />,
          href: "/settings/invoice/vat",
        },
        {
          name: "Abacus Connection",
          icon: <FileSymlink {...iconProps} />,
          href: "/settings/invoice/abacus-connection",
        },
      ],
    },
  ];
  