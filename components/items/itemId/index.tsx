import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SerialNumbers from "../SerialNumbers";

export interface TabType {
  _item_id: string | any,
  onUpdated?: (data: any) => void
}

export const tabLinks = [
  {
    name: 'Details',
    path: 'details',
  },
  {
    name: 'Units',
    path: 'units',
  },
  {
    name: 'Codifications',
    path: 'codifications',
  },
  {
    name: 'Prices',
    path: 'prices',
  },
  {
    name: 'Documents',
    path: 'documents',
  },
  {
    name: 'Serial Numbers',
    path: 'serial-numbers',
  },
]; 

export function ItemTab(props: { children?: React.ReactNode, className?: string, href?: any }) {
  return (
    <Link
      href={props.href}
      className={cn(
        "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium",
        props.className
      )}
    >{props.children}</Link>
  )
}

export function ItemTabs() {
  const router = useRouter();
  const itemIdParams = router.query.itemId;
  let _item_id: any = null;
  let _item_id_2: any = null;

  if (itemIdParams) {
    _item_id = itemIdParams[0];
    if (itemIdParams[1]) {
      _item_id_2 = itemIdParams[1]
    }
  }

  if (!_item_id && !_item_id_2) {
    return <></>;
  }

  return (
    <>
      {tabLinks.map((link: any, key: number) => (
        <ItemTab 
          key={key}
          href={'/items/equipment/' + _item_id + '/' + link.path}
          className={cn(
            _item_id_2 === link.path  && "bg-stone-600 text-stone-200"
          )}
        >
          {link.name}
        </ItemTab>
      ))}
    </>
  );
}