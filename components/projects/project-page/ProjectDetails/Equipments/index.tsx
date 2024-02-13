import MoreOption from "@/components/MoreOption";
import { ItemMenu, TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { AccessTokenContext } from "@/context/access-token-context";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { ChevronDown, MinusCircle, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import useSWR from "swr";
import EquipmentToAdd from "./EquipmentToAdd";
import { ScrollArea } from "@/components/ui/scroll-area";
import Pagination from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const Equipments = ({ headerSize }: { headerSize?: any }) => {
  const project: any = useContext(ProjectDetailsContext);
  const [page, setPage] = useState(1);
  const access_token = useContext(AccessTokenContext);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertLoading, setalertLoading] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState<any>(null);
  const [alertFromShipping, setAlertFromShipping] = useState(false);

  const payload: any = { page };
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, error, mutate } = useSWR(
    [
      project.data?._project_id
        ? `/api/projects/${project.data?._project_id}/equipment?${queryString}`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onDelete = (item: any) => {
    setToDeleteItem(item);
    setOpenAlertMessage(true);
  };

  const onForceDelete = async () => {
    const formData = new FormData();

    formData.append("project_equipment_id", toDeleteItem?.project_equipment_id);

    try {
      setalertLoading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${project?.data?._project_id}/equipment/delete`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Deleted successfully.`,
          variant: "success",
          duration: 2000,
        });
        setalertLoading(false);
        setToDeleteItem(null);
        setOpenAlertMessage(false);
        mutate(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onAddFromShipping = async () => {
    try {
      setalertLoading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${project?.data?._project_id}/equipment/add_from_shipping`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Deleted successfully.`,
          variant: "success",
          duration: 2000,
        });
        mutate(data);
        setalertLoading(false);
        setAlertFromShipping(false);
      } else {
        toast({
          title: `No item to add from shipping.`,
          variant: "error",
          duration: 2000,
        });
        setalertLoading(false);
        setAlertFromShipping(false);
      }
    } catch (err) {
      console.log(err);
      setalertLoading(false);
      setAlertFromShipping(false);
    }
  };

  return (
    <>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={alertLoading}
              onClick={() => setOpenAlertMessage(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={alertLoading}
              onClick={onForceDelete}
              className={cn(alertLoading && "loading")}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertFromShipping}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add item from Shipping List?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertFromShipping(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onAddFromShipping}
              className={cn(alertLoading && "loading")}
            >
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-start gap-[10px] mt-[10px]">
        <EquipmentToAdd
          headerSize={headerSize}
          onSuccessAdd={() => mutate(data)}
        />

        <ScrollArea
          className="w-[72%]"
          viewPortClassName="flex bg-background rounded-xl min-h-[300px] flex-col overflow-hidden "
          viewPortStyle={{
            height: `calc(100vh - var(--header-height) - ${headerSize?.height}px - 50px)`,
          }}
        >
          <div className="flex justify-between items-center p-3 sticky top-0 backdrop-blur-sm bg-background/70">
            <p className="font-medium text-base">Added Equipments</p>
            <div className="flex items-center gap-2">
              <form>
                <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
                  <Search className="text-stone-400 w-5 h-5" />
                  <input
                    placeholder="Search"
                    className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
                    name="search"
                  />
                </div>
              </form>
              <MoreOption
                menuTriggerChildren={
                  <Button
                    className="px-3 rounded-xl py-1.5"
                    variant={"secondary"}
                  >
                    <ChevronDown className="w-[18px]" />
                  </Button>
                }
              >
                <ItemMenu
                  className="flex gap-3 items-center"
                  onClick={() => setAlertFromShipping(true)}
                >
                  <Plus className="w-[18px]" />
                  <span className="font-medium">Add From Shipping List</span>
                </ItemMenu>
              </MoreOption>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <TH>Item Name</TH>
                <TH>Article Number</TH>
                <TH className="text-right pe-4">Actions</TH>
              </tr>
            </thead>
            <tbody>
              {(project.isLoading || isLoading) &&
                Array.from({ length: 6 }).map((item: any, key: number) => (
                  <tr key={key}>
                    <TD>
                      <div className="flex gap-2 items-center">
                        <Skeleton className="w-[40px] h-[40px]" />
                        <Skeleton className="w-[100px] h-[15px]" />
                      </div>
                    </TD>
                    <TD>
                      <Skeleton className="w-[100px] h-[15px]" />
                    </TD>
                    <TD></TD>
                  </tr>
                ))}
              {Array.isArray(data?.list) && data.list.length === 0 && (
                <tr>
                  <td className="py-4 text-center opacity-80" colSpan={3}>
                    No Records were found.
                  </td>
                </tr>
              )}

              {Array.isArray(data?.list) &&
                data.list.map((item: any, key: number) => (
                  <tr key={key} className="hover:bg-stone-100">
                    <TD>
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            baseUrl + "/equipments/thumbnail/" + item.item_image
                          }
                          width={50}
                          height={50}
                          className="w-[50px] h-[50px] object-cover rounded-sm"
                          alt={item.item_name || "equipment"}
                          onError={(e: any) => {
                            e.target.srcset = `${baseUrl}/equipments/thumbnail/Coming_Soon.jpg`;
                          }}
                        />
                        <span className="font-medium">{item.item_name}</span>
                      </div>
                    </TD>
                    <TD>{item.article_number}</TD>
                    <TD className="text-right pe-4">
                      <div className="flex justify-end">
                        <Button
                          variant={"outline"}
                          className="py-1 px-3 flex items-center gap-2"
                          onClick={() => onDelete(item)}
                        >
                          <MinusCircle className="w-[17px] text-red-700" />
                          Remove
                        </Button>
                      </div>
                    </TD>
                  </tr>
                ))}
            </tbody>
          </table>

          {data?.pager && (
            <div className="sticky bottom-0 backdrop-blur-sm bg-background/70">
              <Pagination
                pager={data.pager}
                onPaginate={(page) => setPage(page)}
                currPage={page}
              />
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default Equipments;
