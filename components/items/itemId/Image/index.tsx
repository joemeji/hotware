import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Plus, X } from "lucide-react";
import { faker } from "@faker-js/faker";
import NextImage from "next/image";
import useSWR from "swr";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";
import { item_image_base } from "@/lib/azureUrls";
import AddImage from "./modals/AddImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SetDefaultImageModal } from "./modals/SetDefaultImage";

const Image = () => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const _item_id = router?.query.item_id;
  const [openAddImage, setOpenAddImage] = useState(false);
  const [openMakeDefaultImage, setOpenMakeDefaultImage] = useState(false);
  const [openMakeDefaultModal, setOpenMakeDefaultModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>([]);

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/items/image/get/${_item_id}`, access_token],
    fetchApi
  );

  async function setDefaultImage() {}
  return (
    <ScrollArea className="h-[calc(100vh-var(--header-height))]">
      {openAddImage && (
        <AddImage
          open={openAddImage}
          onOpenChange={(open: any) => setOpenAddImage(open)}
          onSuccess={() => mutate(data)}
        />
      )}
      {openMakeDefaultModal && (
        <SetDefaultImageModal
          open={openMakeDefaultModal}
          onOpenChange={(open: any) => setOpenMakeDefaultModal(open)}
          onSuccess={() => {
            setSelectedImage([]);
            setOpenMakeDefaultImage(false);
            mutate(data);
          }}
          image={selectedImage}
        />
      )}
      <div className="flex justify-between items-center sticky top-0 backdrop-blur bg-white/30 p-4 rounded-b-xl">
        <div>
          <h1 className="font-medium text-lg mb-1">Images</h1>
        </div>
        <div className="flex gap-2">
          {openMakeDefaultImage ? (
            <>
              <button
                className="bg-cyan-200 p-2 rounded-xl hover:bg-cyan-300 font-medium"
                onClick={() => setOpenMakeDefaultModal(true)}
              >
                Set Default Image
              </button>
              <button
                className="bg-red-200 p-2 rounded-xl hover:bg-red-300 font-medium"
                onClick={() => {
                  setSelectedImage([]);
                  setOpenMakeDefaultImage(false);
                }}
              >
                <X />
              </button>
            </>
          ) : (
            <button
              className="bg-stone-200 p-2 rounded-xl hover:bg-stone-300"
              onClick={() => setOpenAddImage(true)}
            >
              <Plus className="text-stone-600" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col rounded-t-xl overflow-hidden p-3 gap-3">
        {isLoading && (
          <div className="flex flex-col gap-2 items-center">
            <Skeleton className="w-full h-[400px]" />
            <Skeleton className="w-full h-[3000px]" />
          </div>
        )}
        {data && data.images.length == 0 && (
          <NextImage
            src="/images/No data-rafiki.svg"
            alt="No Data to Shown"
            width={400}
            height={400}
          />
        )}
        {data && (
          <>
            {data.images
              .filter((img: any) => img.is_default === "1")
              .map((defaultImg: any, key: number) => (
                <NextImage
                  key={key}
                  src={`${baseUrl}/equipments/web/${defaultImg.item_image_filename}`}
                  alt="Default Equipment Image"
                  className="object-cover text-xs rounded-md w-full"
                  width={500}
                  height={500}
                />
              ))}
            <hr />
            {data.images
              .filter((img: any) => img.is_default !== "1")
              .map((img: any, key: number) => (
                <NextImage
                  key={key}
                  src={`${baseUrl}/equipments/web/${img.item_image_filename}`}
                  alt="Equipment Image"
                  className={cn(
                    "object-cover text-xs rounded-md w-full hover:cursor-pointer",
                    openMakeDefaultImage && "bg-cyan-200 p-1"
                  )}
                  width={500}
                  height={500}
                  onClick={() => {
                    setOpenMakeDefaultImage(true);
                    setSelectedImage(img);
                  }}
                />
              ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default Image;
