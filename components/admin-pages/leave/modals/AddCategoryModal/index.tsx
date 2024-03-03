import React, { useState } from "react";
import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { CategoryForm } from "../../form/CategoryForm";
import { TD, TH } from "../..";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useDelete } from "./useDelete";
import { ActionMenu } from "./Actions";

export const AddCategoryModal = (props: AddCategoryModalProps) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange } = props;
  const [selected, setSelected] = useState<any>(null);

  const { data: categories, mutate } = useSWR(
    session?.user?.access_token
      ? ["/api/leaves/categories", session?.user?.access_token]
      : null,
    fetchApi
  );
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      mutate();
    },
  });

  const handleSuccess = () => {
    mutate();
    setSelected(null);
  };

  const handleReset = () => {
    setSelected(null);
  };

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title="Categories">
      <DeleteDialog />
      <div className="pb-5 px-7">
        <CategoryForm
          selected={selected}
          onOpenChange={onOpenChange}
          onSuccess={handleSuccess}
          onReset={handleReset}
        />
        <table className="w-full mt-4">
          <thead>
            <tr>
              <TH>Name</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category: any, i: number) => {
              return (
                <tr key={i} className="even:bg-stone-50 hover:bg-stone-100">
                  <TD className="flex items-center gap-2.5">
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: category.excuse_category_color,
                      }}
                    ></div>
                    {category.excuse_category_name}
                  </TD>
                  <TD>
                    <ActionMenu
                      onDelete={() => mutateDelete(category.excuse_category_id)}
                      onEdit={() => setSelected(category)}
                      data={{
                        id: category.excuse_category_id,
                      }}
                    />
                  </TD>
                </tr>
              );
            })}
            {!categories?.length ? (
              <tr>
                <TD colspan={3} className="text-center">
                  No records found.
                </TD>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </GenericModal>
  );
};

type AddCategoryModalProps = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
