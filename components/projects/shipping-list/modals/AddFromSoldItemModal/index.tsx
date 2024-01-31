import ItemSelect from "@/components/ItemSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ShippingCategory } from "../AddCategoryModal";
import SelectShippingCategoryModal from "../SelectShippingCategoryModal";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { useSWRConfig } from "swr";
import { AccessTokenContext } from "@/context/access-token-context";

function AddFromSoldItemModal(props: AddEquipmentModalType) {
  const {
    open,
    onOpenChange,
    shipping_id,
    excludedEquipments,
    itemCategory,
    existingEquipmentOnly,
    existingEquipments,
  } = props;
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [tab, setTab] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchItemValue, setSearchItemValue] = useState<any>(null);
  const [openSelectCategory, setOpenSelectedCategory] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInput = searchInputRef.current;
  const { mutate } = useSWRConfig();
  const access_token: any = useContext(AccessTokenContext);

  const warehouse_id = shippingDetails ? shippingDetails.warehouse_id : null;

  const onSearchItem = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchItemValue(formData.get("search") || "");
    setSubCategoryId(null);
  };

  const onMoveItemToCategory = useCallback(
    (selectedCategory: ShippingCategory) => {
      const _selectedItems = selectedItems ? [...selectedItems] : [];
      _selectedItems.forEach((item: any, index: number) => {
        if (item.isSelected) {
          _selectedItems[index].shippingCategory = selectedCategory;
        }
      });
      setSelectedItems(_selectedItems);
    },
    [selectedItems]
  );

  const onClickSaveSelectedEquipment = useCallback(async () => {
    setLoadingSubmit(true);
    let payload = selectedItems.map((item: any) => {
      const returnData: any = { item_sale_id: item._item_id };
      return returnData;
    });

    const options = {
      method: "POST",
      body: JSON.stringify({ items: payload[0] }),
    };

    try {
      const res = await fetch(
        `/api/shipping/${shipping_id}/addFromSoldItem`,
        options
      );
      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/shipping/${shipping_id}/items`);
        setTimeout(() => {
          setLoadingSubmit(false);
          onOpenChange && onOpenChange(false);
        }, 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
    }
  }, [selectedItems, shipping_id, onOpenChange, mutate]);

  useEffect(() => {
    if (tab === "allItems") {
      setCategoryId(null);
      setSubCategoryId(null);
    }
  }, [tab]);

  useEffect(() => {
    if (!open) {
      setCategoryId(null);
      setTab(null);
      setSubCategoryId(null);
      setSearchItemValue(null);
      setOpenSearch(false);
      setSelectedItems([]);
    }
  }, [open]);

  useEffect(() => {
    if (itemCategory) setSelectedCategory(itemCategory);
    else setSelectedCategory(null);
  }, [itemCategory]);

  useEffect(() => {
    if (itemCategory && selectedItems.length > 0) {
      setSelectedItems((selectedItems: any) => {
        return selectedItems.map((item: any) => ({
          ...item,
          shippingCategory: itemCategory,
        }));
      });
    }
  }, [itemCategory, selectedItems]);

  const HeaderText = () => {
    return (
      <div className="py-2 px-4 sticky top-0 bg-white z-10 text-lg font-medium text-center">
        Select Equipment Below
      </div>
    );
  };

  return (
    <>
      <SelectShippingCategoryModal
        shipping_id={shipping_id}
        access_token={access_token}
        open={openSelectCategory}
        onOpenChange={(open: boolean) => setOpenSelectedCategory(open)}
        onSelectedCategory={onMoveItemToCategory}
      />
      <Dialog
        open={open}
        onOpenChange={(open) =>
          onOpenChange && !loadingSubmit && onOpenChange(open)
        }
      >
        <DialogContent className="p-0 overflow-auto gap-1 bg-transparent shadow-none max-w-[600px]">
          <div className="min-h-[700px] max-h-[calc(100vh-100px)]">
            <div className="flex flex-col overflow-hidden bg-white rounded-sm">
              <ItemSelect
                access_token={access_token}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                selectedItems={selectedItems}
                onSelectItems={(selectedItems: any) =>
                  setSelectedItems(selectedItems)
                }
                renderSelectedItems={tab === "selectedItems"}
                search={searchItemValue}
                excludedEquipments={excludedEquipments}
                existingEquipmentOnly={existingEquipmentOnly}
                existingEquipments={existingEquipments}
                className="max-h-[calc(100vh-100px-60px)] w-full flex flex-col"
                bodyClassName="p-2 pe-3"
                warehouse_id={warehouse_id}
                isSoldItem={true}
                headChildren={
                  !existingEquipmentOnly ? (
                    <>
                      <MenuHeader className="px-3 items-center justify-between sticky top-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm ms-3 text-stone-500">
                            All Sold Items
                          </p>
                        </div>
                        <MenuHeaderButton
                          className="hover:bg-stone-100 p-2 rounded-xl"
                          onClick={(e: any) => {
                            setOpenSearch(true);
                            if (searchInput) {
                              e.target.blur();
                              searchInput.focus();
                            }
                          }}
                        >
                          <Search className="w-5 h-5" />
                        </MenuHeaderButton>
                        <form
                          className={cn(
                            "absolute left-0 top-0 bg-background flex w-full items-center",
                            "overflow-hidden transition-all duration-200 h-0 px-2 gap-2",
                            openSearch && "h-full"
                          )}
                          onSubmit={onSearchItem}
                        >
                          <div className="bg-stone-100 flex items-center w-full rounded-xl overflow-hidden px-2 h-9">
                            <Search className="text-stone-400 w-5 h-5" />
                            <input
                              placeholder="Search Item"
                              className={cn(
                                "border-0 rounded-none outline-none text-sm w-full px-2 bg-transparent h-full"
                              )}
                              ref={searchInputRef}
                              name="search"
                            />
                          </div>
                          <div className="flex gap-1 items-center">
                            <Button type="submit" className="py-1.5 px-3">
                              Search
                            </Button>
                            <button
                              type="button"
                              className="hover:bg-stone-200 p-1.5 rounded-xl"
                              onClick={() => {
                                setOpenSearch(false);
                              }}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </form>
                      </MenuHeader>
                    </>
                  ) : (
                    <HeaderText />
                  )
                }
              />
              <div className="p-2 flex gap-1 justify-end z-10 mt-auto h-[60px] items-center">
                <div className="flex gap-2">
                  <Button
                    className={cn(loadingSubmit && "loading")}
                    variant={"ghost"}
                    onClick={() => onOpenChange && onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className={cn(loadingSubmit && "loading")}
                    disabled={loadingSubmit || selectedItems.length === 0}
                    onClick={onClickSaveSelectedEquipment}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddFromSoldItemModal);

function MenuHeaderButton({ children, active, ...rest }: any) {
  return (
    <button
      className={cn(
        "bg-stone-200 hover:bg-stone-300 py-1.5 text-sm font-medium px-3 rounded-xl",
        active && "bg-primary text-white hover:bg-stone-600"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function MenuHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        " h-[50px] flex sticky top-0 bg-background z-10",
        className
      )}
    >
      {children}
    </div>
  );
}

type AddEquipmentModalType = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  shipping_id: any;
  excludedEquipments?: any[];
  itemCategory?: any;
  existingEquipmentOnly?: boolean;
  existingEquipments?: any;
};
