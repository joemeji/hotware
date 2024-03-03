import { iconProps } from "@/components/admin-layout/sidebar/user-settings";
import { TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowBigRightDash,
  ArrowRight,
  ChevronDown,
  Cog,
  CornerDownRight,
  Folder,
  Forward,
  Layers,
  Milestone,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { memo, useContext, useState } from "react";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/LoadingList";
import { File } from "lucide-react";
import UserServiceSelect from "@/components/app/user-service-select";
import { AddNewServiceModal } from "./modals/AddServiceModal";
import useSWR from "swr";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingMore from "@/components/LoadingMore";
import Image from "next/image";
import Header from "./header";
import { AddNewCategoryModal } from "./modals/AddCategoryModal";
import { AddNewSkillModal } from "./modals/AddSkillModal";
import { FolderClosed } from "lucide-react";
import { DeleteData } from "./modals/DeleteData";
import { UpdateCategoryModal } from "./modals/UpdateCategoryModal";
import { UpdateSkill } from "./modals/UpdateSkillModal";
import { debounce } from "lodash";
import SearchInput from "@/components/app/search-input";

export const ServiceSetting = () => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [openAddServiceModal, setOpenAddNewServiceModal] = useState(false);
  const [openAddCategorymodal, setOpenAddCategoryModal] = useState(false);
  const [openAddSkillModal, setOpenAddSkillModal] = useState(false);
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false);
  const [openUpdateSkillModal, setOpenUpdateSkillModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDir, setSelectedDir] = useState<any>(null);
  const [search, setSearched] = useState("");
  const [selectedService, setSelectedService] = useState<any>(
    router.query?.service_id ? router.query?.service_id : null
  );
  const urlPayload: any = {};
  urlPayload["service_id"] = router.query?.service_id
    ? router.query?.service_id
    : "";
  urlPayload["parent_id"] = router.query?.parent_id
    ? router.query?.parent_id
    : 0;
  urlPayload["search"] = search;

  let searchParams = new URLSearchParams(urlPayload);

  const { data, isLoading, mutate } = useSWR(
    router.query?.service_id
      ? [`/api/users/service/details?${searchParams.toString()}`, access_token]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  return (
    <div className="flex flex-col bg-white rounded-app w-full">
      {openAddServiceModal && (
        <AddNewServiceModal
          open={openAddServiceModal}
          onOpenChange={(open: any) => setOpenAddNewServiceModal(open)}
        />
      )}
      {openAddCategorymodal && (
        <AddNewCategoryModal
          open={openAddCategorymodal}
          onOpenChange={(open: any) => setOpenAddCategoryModal(open)}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {openAddSkillModal && (
        <AddNewSkillModal
          open={openAddSkillModal}
          onOpenChange={(open: any) => setOpenAddSkillModal(open)}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {openUpdateCategoryModal && (
        <UpdateCategoryModal
          open={openUpdateCategoryModal}
          onOpenChange={(open: any) => setOpenUpdateCategoryModal(open)}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
          dir={selectedDir}
        />
      )}
      {openUpdateSkillModal && (
        <UpdateSkill
          open={openUpdateSkillModal}
          onOpenChange={(open: any) => setOpenUpdateSkillModal(open)}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
          dir={selectedDir}
        />
      )}
      {openDeleteModal && (
        <DeleteData
          open={openDeleteModal}
          onOpenChange={(open: any) => setOpenDeleteModal(open)}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
          dir={selectedDir}
        />
      )}
      <div className={cn("bg-white px-7 py-3 rounded-app", {})}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light mb-5">Manage SkillEvaluation</h1>
          <Button variant="red" onClick={() => setOpenAddNewServiceModal(true)}>
            <Plus {...iconProps} />
            Add Services
          </Button>
        </div>
        <hr className="mt-2 mb-2" />
        <div className="flex items-center justify-between w-full">
          <Header
            onDirectory={() => mutate(data)}
            selectedService={data && data.service}
          />
          <div className="flex gap-2 w-[40%]">
            <div className="w-full">
              <UserServiceSelect
                value={selectedService}
                onChangeValue={(value: any) => {
                  router.push(
                    `/settings/user/service?service_id=${value}&parent_id=0&search=`
                  );
                  setSelectedService(value);
                }}
              />
            </div>
            {selectedService && (
              <MoreOption
                menuTriggerChildren={
                  <Button className="py-1 flex gap-1 px-2 ps-3">
                    <span>New</span>
                    <ChevronDown className="w-[18px]" />
                  </Button>
                }
              >
                <ItemMenu
                  className="gap-3"
                  onClick={() => setOpenAddCategoryModal(true)}
                >
                  <Layers className="w-[18px] h-[18px] fill-orange-300 stroke-orange-300" />
                  <span className="font-medium">Category</span>
                </ItemMenu>
                <ItemMenu
                  className="gap-3"
                  onClick={() => setOpenAddSkillModal(true)}
                >
                  <Cog className="w-[18px] h-[18px] fill-red-200 stroke-red-600" />
                  <span className="font-medium">Skills</span>
                </ItemMenu>
              </MoreOption>
            )}
            <div className="w-full">
              <SearchInput
                width={360}
                onChange={(e) => setSearched(e.target.value)}
                value={search}
                delay={500}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6">
        <ScrollArea
          className="w-[100%] bg-white rounded-app"
          viewPortClassName="h-[calc(100vh-var(--header-height)-40px)]"
        >
          {isLoading ? (
            <div className="flex justify-center items-center flex-col">
              <LoadingMore />
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky z-10 top-0">
                <tr>
                  <TH className="w-[90%]">Name</TH>
                  <TH className="w-[10%] text-center">Action</TH>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data?.list) && data.list.length > 0 ? (
                  data.list.map((dir: any, key: number) => (
                    <tr key={key}>
                      <TD>
                        <div
                          className={cn(
                            "flex items-center gap-3",
                            dir.is_dir === "1" &&
                              "hover:underline hover:underline-offset-2 hover:cursor-pointer"
                          )}
                        >
                          {dir.is_dir === "1" ? (
                            <Directory dir={dir} />
                          ) : (
                            <>
                              <Forward height={18} color="gray" />
                              {dir.category_name}
                            </>
                          )}
                        </div>
                      </TD>
                      <TD className="text-center">
                        <MoreOption>
                          <ItemMenu
                            className="gap-3"
                            onClick={() => {
                              if (dir.is_dir === "1") {
                                setOpenUpdateCategoryModal(true);
                              } else {
                                setOpenUpdateSkillModal(true);
                              }
                              setSelectedDir(dir);
                            }}
                          >
                            <Pencil className="w-[18px] h-[18px] text-orange-500" />
                            <span className="font-medium">Update</span>
                          </ItemMenu>
                          <ItemMenu
                            className="gap-3"
                            onClick={() => {
                              setOpenDeleteModal(true);
                              setSelectedDir(dir);
                            }}
                          >
                            <Trash className="w-[18px] h-[18px] text-red-500" />
                            <span className="font-medium">Delete</span>
                          </ItemMenu>
                        </MoreOption>
                      </TD>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TD className="text-center" colspan={2}>
                      <div className="flex justify-center">
                        <Image
                          src="/images/No data-rafiki.svg"
                          width={300}
                          height={300}
                          alt="No Data to Shown"
                        />
                      </div>
                    </TD>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export const TD = ({
  className,
  children,
  colspan,
}: {
  className?: string;
  children?: React.ReactNode;
  colspan?: any;
}) => (
  <td
    colSpan={colspan}
    className={cn(
      "py-2 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);

const Directory = ({ dir }: { dir: any }) => {
  const router = useRouter();
  const onClick = () => {
    const query: any = { ...router.query };
    query.parent_id = dir.usc_id;

    const dirs: any = jsonDirs();

    if (Array.isArray(dirs)) {
      dirs.push({
        name: dir.category_name,
        id: dir.usc_id,
      });
    }

    if (Array.isArray(dirs) && dirs.length > 0) {
      query.dirs = JSON.stringify(dirs);
    }

    let searchParams = new URLSearchParams(query);
    router.push("/settings/user/service?" + searchParams.toString());
  };

  const jsonDirs = () => {
    const query: any = { ...router.query };
    try {
      if (query.dirs) {
        return JSON.parse(query.dirs);
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  return (
    <button
      className="flex items-center gap-3 hover:underline"
      onClick={onClick}
    >
      <FolderClosed
        className="fill-orange-300 stroke-orange-400"
        strokeWidth={0.5}
        height={18}
      />
      <span
        title={dir.category_name}
        className="whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {dir.category_name}
      </span>
    </button>
  );
};
