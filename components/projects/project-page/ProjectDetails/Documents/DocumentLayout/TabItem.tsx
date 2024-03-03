import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const TabItem = ({ label, icon, href, active }: TabItem) => {
  const router = useRouter();

  const basePath = `/projects/${router.query.project_id}/documents`;

  return (
    <li className="flex">
      <Link
        href={basePath + href}
        className={cn(
          "hover:bg-stone-100 py-2 flex items-start gap-3 font-medium w-full px-3",
          active && "bg-stone-200 pointer-events-none"
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

type TabItem = {
  label?: any;
  icon?: React.ReactNode;
  href?: any;
  active?: boolean;
};

export default TabItem;
