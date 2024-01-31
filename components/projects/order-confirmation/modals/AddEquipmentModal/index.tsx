import CategorySelect from "@/components/CategorySelect";
import ItemSelect, { Item } from "@/components/ItemSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { truncate } from "@/utils/text";
import { Forward, MinusCircle, Search, Trash, X } from "lucide-react";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { OrderConfirmationDetailsContext } from "@/context/order-confirmation-details-content";
import { useSWRConfig } from "swr";
import { AccessTokenContext } from "@/context/access-token-context";
import { useSession } from "next-auth/react";

function AddEquipmentModal(props: AddEquipmentModalType) {
  const { data: session }: any = useSession();
  const {
    open,
    onOpenChange,
    order_confirmation_id,
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInput = searchInputRef.current;
  const { mutate } = useSWRConfig();
  const access_token: any = useContext(AccessTokenContext);

  const onSelectCategory = (_categoryId: any) => {
    setCategoryId(null);
    setSubCategoryId(null);
    setSearchItemValue(null);
    setOpenSearch(false);
    if (_categoryId && isNaN(_categoryId)) {
      if (categoryId == _categoryId) setCategoryId(null);
      else setCategoryId(_categoryId);
    } else {
      if (subCategoryId == _categoryId) setSubCategoryId(null);
      else setSubCategoryId(_categoryId);
    }
  };

  const _selectedCategory = () => {
    if (!categoryId && !subCategoryId) return "All Items";
    if (
      selectedCategory &&
      typeof selectedCategory.item_category_name !== "undefined"
    ) {
      return selectedCategory.item_category_name;
    }
    if (
      selectedCategory &&
      typeof selectedCategory.item_sub_category_name !== "undefined"
    ) {
      return selectedCategory.item_sub_category_name;
    }
    return "All Items";
  };

  const checkedSelectedItems = () => {
    return selectedItems.filter((item: any) => item.isSelected);
  };

  const onDeleteSelectedItems = () => {
    let _selectedItems = [...selectedItems];
    if (!checkedSelectedItems()) return;
    checkedSelectedItems().forEach((filteredItem: Item) => {
      _selectedItems = _selectedItems.filter(
        (item: Item) => item._item_id !== filteredItem._item_id
      );
    });
    setTimeout(() => {
      setSelectedItems(_selectedItems);
    }, 200);
  };

  const onSearchItem = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchItemValue(formData.get("search") || "");
    setSubCategoryId(null);
  };

  const onRemoveSelectedItemsCategory = useCallback(() => {
    const _selectedItems = selectedItems ? [...selectedItems] : [];
    _selectedItems.forEach((item: any, index: any) => {
      if (item.isSelected) delete _selectedItems[index].shippingCategory;
    });
    setSelectedItems(_selectedItems);
  }, [selectedItems]);

  const onClickSaveSelectedEquipment = async () => {
    setLoadingSubmit(true);
    let payload = selectedItems.map((item: any) => {
      const returnData: any = {
        _item_id: item._item_id,
        is_custom: item.is_custom,
      };
      return returnData;
    });

    const options = {
      method: "POST",
      body: JSON.stringify({ items: payload }),
      headers: { ...authHeaders(session?.user?.access_token) },
    };

    const uri = "/api/projects/orders/items/create/";

    try {
      const res = await fetch(baseUrl + uri + order_confirmation_id, options);
      const json = await res.json();
      if (json && json.success) {
        mutate([
          `/api/projects/orders/items/${order_confirmation_id}`,
          session?.user?.access_token,
        ]);
        setTimeout(() => {
          setLoadingSubmit(false);
          onOpenChange && onOpenChange(false);
        }, 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
    }
  };

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
      <Dialog
        open={open}
        onOpenChange={(open) =>
          onOpenChange && !loadingSubmit && onOpenChange(open)
        }
      >
        <DialogContent
          className="p-0 overflow-auto gap-1 bg-transparent shadow-none"
          style={{
            maxWidth: !existingEquipmentOnly ? "1100px" : "700px",
          }}
        >
          <div className="min-h-[700px] max-h-[calc(100vh-100px)] flex gap-3">
            {!existingEquipmentOnly && (
              <ScrollArea
                className="bg-white rounded-sm"
                style={{
                  width: !existingEquipmentOnly ? "410px" : 0,
                }}
              >
                <MenuHeader className="justify-center items-center text-lg font-medium">
                  Filter By Categories
                </MenuHeader>
                <CategorySelect
                  access_token={access_token}
                  onSelect={onSelectCategory}
                  selected={categoryId || subCategoryId}
                  onSelectedInfo={(category) => setSelectedCategory(category)}
                />
              </ScrollArea>
            )}
            <div
              className="flex flex-col overflow-hidden bg-white rounded-sm"
              style={{
                width: existingEquipmentOnly ? "100%" : "calc(100% - 410px)",
              }}
            >
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
                className="w-100% max-h-[calc(100vh-100px-60px)] w-full flex flex-col"
                bodyClassName="p-2 pe-3"
                headChildren={
                  !existingEquipmentOnly ? (
                    <>
                      <HeaderText />
                      <MenuHeader className="px-3 items-center justify-between sticky top-0">
                        <div className="flex items-center gap-1">
                          <MenuHeaderButton
                            onClick={() => {
                              setTab("allItems");
                              setCategoryId(null);
                              setSubCategoryId(null);
                              setSearchItemValue(null);
                            }}
                            active={tab === "allItems"}
                          >
                            All Items
                          </MenuHeaderButton>
                          <MenuHeaderButton
                            onClick={() => setTab("selectedItems")}
                            active={tab === "selectedItems"}
                          >
                            Selected Items{" "}
                            {Array.isArray(selectedItems) &&
                            selectedItems.length > 0
                              ? `(${selectedItems.length})`
                              : ""}
                          </MenuHeaderButton>
                          {tab !== "selectedItems" && (
                            <p className="text-sm ms-3 text-stone-500">
                              {truncate(_selectedCategory(), 60)}
                            </p>
                          )}
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
              <div className="p-2 flex gap-1 justify-between z-10 mt-auto h-[60px] items-center">
                <div className="flex items-center">
                  {tab === "selectedItems" && (
                    <>
                      {!itemCategory && (
                        <>
                          <Button
                            className="px-3 flex gap-2 text-stone-600"
                            variant={"ghost"}
                            disabled={
                              checkedSelectedItems() &&
                              checkedSelectedItems().length === 0
                            }
                            onClick={() => setOpenSelectedCategory(true)}
                          >
                            <Forward className="text-purple-500 w-5 h-5" />{" "}
                            <span className="font-normal">
                              Move to Category
                            </span>
                          </Button>
                          <Button
                            className="px-3 flex gap-2 text-stone-600"
                            variant={"ghost"}
                            disabled={
                              checkedSelectedItems() &&
                              (checkedSelectedItems().filter(
                                (item: any) =>
                                  typeof item.shippingCategory === "undefined"
                              ).length > 0 ||
                                checkedSelectedItems().length === 0)
                            }
                            onClick={onRemoveSelectedItemsCategory}
                          >
                            <MinusCircle className="text-red-500 w-4 h-4" />{" "}
                            <span className="font-normal">Remove Category</span>
                          </Button>
                        </>
                      )}
                      <Button
                        className=" px-3 flex gap-2 text-stone-600"
                        variant={"ghost"}
                        disabled={
                          checkedSelectedItems() &&
                          checkedSelectedItems().length === 0
                        }
                        onClick={onDeleteSelectedItems}
                      >
                        <Trash className="text-red-500 w-4 h-4" />{" "}
                        <div className="font-normal">Remove</div>
                      </Button>
                    </>
                  )}
                </div>
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

export default memo(AddEquipmentModal);

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
  order_confirmation_id: any;
  excludedEquipments?: any[];
  itemCategory?: any;
  existingEquipmentOnly?: boolean;
  existingEquipments?: any;
};
