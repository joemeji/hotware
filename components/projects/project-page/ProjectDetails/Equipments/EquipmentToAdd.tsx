import ItemBlockSelect from "@/components/app/item-block-select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import useSize from "@/hooks/useSize";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useContext, useRef, useState } from "react";

const EquipmentToAdd = ({
  headerSize,
  onSuccessAdd,
}: {
  headerSize?: any;
  onSuccessAdd?: () => void;
}) => {
  const cateRef = useRef<any>(null);
  const cateSize: any = useSize(cateRef);
  const headingRef = useRef<any>(null);
  const headingSize: any = useSize(headingRef);
  const bottomRef = useRef<any>(null);
  const bottomSize: any = useSize(bottomRef);
  const [selectedItems, setSelectedItems] = useState<any>(null);
  const project: any = useContext(ProjectDetailsContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const access_token = useContext(AccessTokenContext);

  const onAdd = async () => {
    const formData = new FormData();
    const _item_ids: any = [];

    if (Array.isArray(selectedItems)) {
      selectedItems.forEach((item: any) => {
        _item_ids.push(item._item_id);
      });
    }

    if (_item_ids.length > 0) {
      formData.append("_item_ids", JSON.stringify(_item_ids));
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${project?.data?._project_id}/equipment/add`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Added successfully.`,
          variant: "success",
          duration: 2000,
        });
        setIsSubmitting(false);
        setSelectedItems([]);
        onSuccessAdd && onSuccessAdd();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="bg-background flex flex-col rounded-xl w-[28%]"
      style={{
        height: `calc(100vh - var(--header-height) - ${headerSize?.height}px - 50px)`,
      }}
      ref={cateRef}
    >
      <div ref={headingRef}>
        <p className="font-medium text-base flex items-center py-3 px-3">
          Select Equipments
        </p>
      </div>
      <ItemBlockSelect
        height={cateSize?.height - headingSize?.height - bottomSize?.height}
        selectedItems={selectedItems}
        onSelectItems={(items) => setSelectedItems(items)}
      />
      <div ref={bottomRef} className="mt-auto">
        {Array.isArray(selectedItems) && selectedItems.length > 0 && (
          <div className="p-2">
            <Button
              className={cn("w-full", isSubmitting && "loading")}
              onClick={onAdd}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentToAdd;
