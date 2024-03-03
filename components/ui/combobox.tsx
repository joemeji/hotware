import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { ScrollArea } from "./scroll-area";
import LoadingMore from "../LoadingMore";
import SearchInput from "../app/search-input";

export const ARROWDOWM_WIDTH = 16;

export type Content = {
  text?: React.ReactNode;
  value?: string | any;
};

type ComboboxProps = {
  className?: any;
  placeholder?: any;
  contents?: Content[];
  value?: any;
  onChangeValue?: (value?: any) => void;
  popOverContentClassName?: string;
  isLoading?: boolean;
  onScrollEnd?: (ev?: any) => void;
  isLoadingMore?: boolean;
  onSelectedItem?: (item?: any) => void;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  onSearch?: (value?: any) => void;
  searchWidth?: any;
};

const Combobox = (props: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const {
    className,
    placeholder,
    contents,
    value,
    onChangeValue,
    popOverContentClassName,
    isLoading,
    onScrollEnd,
    isLoadingMore,
    onSelectedItem,
    onOpenChange,
    modal = false,
    onSearch,
    searchWidth,
  } = props;
  const buttonPopOverRef = useRef<HTMLButtonElement>(null);
  const buttonPopOverRefCurrent = buttonPopOverRef.current;
  const [__value, setValue] = useState(value || "");

  const buttonWidth = () => {
    if (buttonPopOverRefCurrent) {
      const { width } = buttonPopOverRefCurrent.getBoundingClientRect();
      return width;
    }
    return null;
  };

  const toLower = (str: string) => {
    if (str) return String(str).toLowerCase();
    return str;
  };

  const _data = useMemo(() => {
    if (!Array.isArray(contents)) return "";
    const _dataFirst = contents.find(
      (item: any) => toLower(item.value) == toLower(__value)
    );
    if (_dataFirst) return _dataFirst.text;
    return `${placeholder || ""}`;
  }, [contents, placeholder, __value]);

  const onSelect = (currentValue?: any, renderedItem?: Content) => {
    if (currentValue === __value) {
      setOpen(false);
      setValue("");
      onChangeValue && onChangeValue("");
    } else {
      setOpen(false);
      setValue(currentValue);
      onChangeValue && onChangeValue(renderedItem?.value);
    }
  };

  useEffect(() => {
    if (typeof value === "number" && !Number.isNaN(value)) {
      setValue(String(value));
    } else {
      setValue(String(value));
    }
  }, [value]);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange && onOpenChange(open);
      }}
      modal={modal}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "bg-stone-100 border-0 w-full h-auto py-3",
            open && "outline-none ring-2 ring-ring ring-offset-2",
            "justify-between !rounded-app font-normal text-left",
            className
          )}
          ref={buttonPopOverRef}
          type="button"
        >
          <span className={`w-[calc(100%-${ARROWDOWM_WIDTH}px)]`}>
            {isLoading
              ? "..."
              : __value
              ? _data
              : <p className="opacity-60">{placeholder}</p> || ""}
          </span>
          <ChevronDown
            className={`ml-2 h-[${ARROWDOWM_WIDTH}px] w-[${ARROWDOWM_WIDTH}px] shrink-0 opacity-50`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-full p-0 border-stone-00 shadow-sm rounded-app",
          popOverContentClassName
        )}
        align="start"
      >
        <div className="p-2 w-full">
          <SearchInput
            onChange={(e) => {
              onSearch && onSearch(e.target.value);
            }}
            width={null}
            delay={500}
          />
        </div>
        {/* {Array.isArray(contents) && contents.length === 0 && (
          <div className="py-4 text-center font-medium px-3">List empty</div>
        )} */}
        {/* {!Array.isArray(contents) && (
          <div className="py-4 text-center font-medium px-3">List empty</div>
        )} */}
        <Command>
          <ScrollArea
            onScrollEndViewPort={onScrollEnd}
            className="combobox-selector"
            style={{ minWidth: buttonWidth() + "px", maxWidth: "400px" }}
          >
            <CommandGroup className="p-0">
              {contents &&
                contents.map((item: Content, key: number) => (
                  <CommandItem
                    key={key}
                    onSelect={(currentValue) => onSelect(currentValue, item)}
                    value={item.value}
                    className={cn(
                      "rounded-none py-2 cursor-pointer items-start",
                      toLower(__value) == toLower(item.value) && "bg-stone-100"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        toLower(__value) == toLower(item.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.text}
                  </CommandItem>
                ))}
              {isLoadingMore && <LoadingMore className="py-1" />}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default memo(Combobox);
