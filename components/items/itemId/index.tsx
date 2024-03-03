import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { EquipmentContext } from "./Layout";

export interface TabType {
  _item_id: string | any;
  onUpdated?: (data: any) => void;
}

export const tabLinks = [
  {
    name: "Details",
    path: "details",
  },
  {
    name: "Units",
    path: "units",
  },
  {
    name: "Codifications",
    path: "codifications",
  },
  {
    name: "Prices",
    path: "prices",
  },
  {
    name: "Documents",
    path: "documents",
  },
  {
    name: "Serial Numbers",
    path: "serial-numbers",
  },
];

export function ItemTab(props: {
  children?: React.ReactNode;
  className?: string;
  href?: any;
}) {
  return (
    <Link
      href={props.href}
      className={cn(
        "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
}

export function ItemTabs() {
  const router = useRouter();
  const item_id = router.query.item_id;
  const equipment: any = useContext(EquipmentContext);

  const _tabLinks = () => {
    let __links: any = [...tabLinks];
    if (equipment && equipment.with_serial == 0) {
      __links = __links.filter((link: any) => link.path !== "serial-numbers");
    }
    return __links;
  };

  return (
    <>
      {_tabLinks().map((link: any, key: number) => (
        <ItemTab
          key={key}
          href={"/items/" + item_id + "/" + link.path}
          className={cn(
            router.asPath.includes(link.path) && "bg-stone-600 text-stone-200"
          )}
        >
          {link.name}
        </ItemTab>
      ))}
    </>
  );
}
