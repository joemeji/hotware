import { SelectAll, TH, TD } from "../..";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFallback } from "@/utils/avatar";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Pagination from "@/components/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import ItemCertification from "./DocumentTypes/ItemCertification";
import GeneralDocuments from "./DocumentTypes/GeneralDocuments";
import SpecificDocuments from "./DocumentTypes/SpecificDocuments";

interface DetailsTabType {
  access_token?: string;
  _item_id?: string;
}

export default function DocumentTab(props: DetailsTabType) {
  const { access_token, _item_id } = props;

  return (
    <div className="mb-6">
      <GeneralDocuments _item_id={_item_id} access_token={access_token} />
      <SpecificDocuments _item_id={_item_id} access_token={access_token} />
      <ItemCertification _item_id={_item_id} access_token={access_token} />
    </div>
  );
}
