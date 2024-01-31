import { memo, useState } from "react";
import { TableHead } from "./TableHead";
import { ItemMenu, TD } from "@/components/items";
import MoreOption from "@/components/MoreOption";
import {
  Plus,
  ArrowRightLeft,
  Link,
  Trash,
  Globe,
  Printer,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/utils/api.config";
import Pagination from "@/components/pagination";
import ChangeCategory from "../modals/CmsCategoryActionModals/ChangeCategory";
import LinkToCompany from "../modals/CmsCategoryActionModals/LinkToCompany";
import { AddToBothCategories } from "../modals/CmsCategoryActionModals/AddToAllCategories";
import { DeleteCms } from "../modals/CmsCategoryActionModals/delete";
import TemporaryLogo from "../temporary-logo";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const List = () => {
  const [changeCategory, setChangeCategory] = useState(false);
  const [linkToCompany, setLinkToCompany] = useState(false);
  const [addToAllCategories, setAddToAllCategories] = useState(false);
  const [deleteCms, setDeleteCms] = useState(false);
  const [cms, setCms] = useState(false);
  const router = useRouter();
  const page = router.query?.page || 1;

  let paramsObj: any = { page: String(page), category: null, ...router.query };
  let searchParams = new URLSearchParams(paramsObj);

  let { data, isLoading, error } = useSWR(
    `/api/cms?${searchParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  function onViewCms(cms_id: any) {
    router.push("/address-manager/" + cms_id);
  }

  function onPaginate(page: any) {
    router.query.page = page;
    router.push(router);
  }

  function onClickCmsOption(action: any, cms: any) {
    if (action == "change-category") {
      setChangeCategory(true);
    } else if (action == "link-company") {
      setLinkToCompany(true);
    } else if (action == "add-to-all-categories") {
      setAddToAllCategories(true);
    } else if (action == "delete") {
      setDeleteCms(true);
    }
    setCms(cms);
  }

  return (
    <div>
      {changeCategory && (
        <ChangeCategory
          open={changeCategory}
          onOpenChange={(open: any) => setChangeCategory(open)}
          cms={cms}
        />
      )}
      {linkToCompany && (
        <LinkToCompany
          open={linkToCompany}
          onOpenChange={(open: any) => setLinkToCompany(open)}
          cms={cms}
        />
      )}
      {addToAllCategories && (
        <AddToBothCategories
          open={addToAllCategories}
          onOpenChange={(open: any) => setAddToAllCategories(open)}
          cms={cms}
        />
      )}
      {deleteCms && (
        <DeleteCms
          open={deleteCms}
          onOpenChange={(open: any) => setDeleteCms(open)}
          cms={cms}
        />
      )}
      <table className="w-full">
        <TableHead />
        <tbody>
          {Array.isArray(data?.cms) && data.cms.length === 0 && (
            <tr>
              <td colSpan={7}>
                <div className="flex justify-center">
                  <Image
                    src="/images/No data-rafiki.svg"
                    width={300}
                    height={300}
                    alt="No Data to Shown"
                  />
                </div>
              </td>
            </tr>
          )}
          {isLoading &&
            Array.from({ length: 7 }).map((item: any, key: number) => (
              <tr key={key}>
                <td className="py-3 ps-4 pe-2 align-top">
                  <Skeleton className="w-[40px] h-[40px] rounded-full" />
                </td>
                <td className="py-3 px-2 align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
                <td className="py-3 px-2 align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
                <td className="py-3 px-2 align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
                <td className="py-3 px-2 align-top">
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
                <td className="py-3 px-2 align-top">
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
                <td className="py-3 px-2 align-top" colSpan={2}>
                  <Skeleton className="w-[100px] h-[15px]" />
                </td>
              </tr>
            ))}
          {Array.isArray(data?.cms) &&
            data.cms.map((cms: any, i: number) => (
              <tr key={i} className="hover:bg-stone-100">
                <TD className="ps-4 py-2 align-top">
                  <TemporaryLogo size={50} cms={cms} />
                </TD>
                <TD className="py-2 px-3 text-center font-medium align-top">
                  {i * Number(page) + 1}
                </TD>
                <TD className="py-2 px-3 align-top">
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-medium underline hover:cursor-pointer"
                      onClick={() => onViewCms(cms._cms_id)}
                    >
                      {cms.cms_name}
                    </span>
                    <span>{cms.default_address_inline}</span>
                  </div>
                </TD>
                <TD className="py-2 px-3 align-top">
                  <div className="flex flex-col">
                    {cms.cms_email && (
                      <span className="flex gap-2 items-center">
                        <Mail className="w-[15px] opacity-50" /> {cms.cms_email}
                      </span>
                    )}
                    {cms.cms_phone_number && (
                      <span className="flex gap-2 items-center">
                        <Phone className="w-[15px] opacity-50" />{" "}
                        {cms.cms_phone_number}
                      </span>
                    )}
                  </div>
                </TD>
                <TD className="py-2 px-3 align-top">
                  <div className="flex flex-col">
                    {cms.cms_website && (
                      <span className="flex gap-2 items-center">
                        <Globe className="w-[15px] opacity-50" />{" "}
                        {cms.cms_website}
                      </span>
                    )}
                    {cms.cms_fax && (
                      <span className="flex gap-2 items-center">
                        <Printer className="w-[15px] opacity-50" />{" "}
                        {cms.cms_fax}
                      </span>
                    )}
                  </div>
                </TD>
                <TD className="py-2 px-3 align-top">
                  {cms.cms_category_id != 0
                    ? cms.cms_category_name
                    : "All Categories"}
                </TD>
                <TD className="py-2 px-3 align-top text-right">
                  <MoreOption>
                    {cmsOptions &&
                      cmsOptions.map((option: any, key: number) => (
                        <ItemMenu
                          key={key}
                          className="gap-3"
                          onClick={() => onClickCmsOption(option.action, cms)}
                        >
                          {option.icon}
                          <span className="font-medium">{option.name}</span>
                        </ItemMenu>
                      ))}
                  </MoreOption>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>

      {data && data.pager && (
        <div className="mt-auto border-t border-t-stone-100">
          <Pagination pager={data.pager} onPaginate={onPaginate} />
        </div>
      )}
    </div>
  );
};

export const cmsOptions = [
  {
    name: "Change Category",
    action: "change-category",
    icon: <ArrowRightLeft className="w-[18px] h-[18px] text-blue-500" />,
  },
  {
    name: "Link to Company",
    action: "link-company",
    icon: <Link className="w-[18px] h-[18px] text-purple-500" />,
  },
  {
    name: "Add to all Categories",
    action: "add-to-all-categories",
    icon: <Plus className="w-[18px] h-[18px] text-green-500" />,
  },
  {
    name: "Set Company Availability",
    action: "company-availability",
    icon: <Building2 className="w-[18px] h-[18px] text-stone-500" />,
  },
  {
    name: "Delete",
    action: "delete",
    icon: <Trash className="w-[18px] h-[18px] text-red-500" />,
  },
];

export default memo(List);
