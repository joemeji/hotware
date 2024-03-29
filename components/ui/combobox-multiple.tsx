import { memo, useEffect, useRef, useState } from "react";
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
  label?: string;
};

type ComboboxMultiPRops = {
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
};

const ComboboxMulti = (props: ComboboxMultiPRops) => {
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
  } = props;
  const buttonPopOverRef = useRef<HTMLButtonElement>(null);
  const buttonPopOverRefCurrent = buttonPopOverRef.current;
  const [__value, setValue] = useState(value || []);

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

  const _data = () => {
    return (
      __value &&
      __value.length > 0 &&
      __value
        .map((v: any) => contents?.find((j) => j.value === v)?.label)
        .join(", ")
    );
  };

  const onSelect = (currentValue?: any, renderedItem?: Content) => {
    if (Array.isArray(__value)) {
      const ___value = [...__value];
      const valIndex = ___value.findIndex((val: any) => val === currentValue);

      // double check if value exists
      // if so , deselect
      if (valIndex > -1) {
        ___value.splice(valIndex, 1);
      } else {
        ___value.push(currentValue);
      }

      setValue(___value);
      onChangeValue && onChangeValue(___value);
    }
  };

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
          <span className={`line-clamp-1 w-[calc(100%-${ARROWDOWM_WIDTH}px)]`}>
            {isLoading ? "..." : __value ? _data() : placeholder || ""}
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
        {Array.isArray(contents) && contents.length === 0 && (
          <div className="py-4 text-center font-medium px-3">List empty</div>
        )}
        {!contents && (
          <div className="py-4 text-center font-medium px-3">List empty</div>
        )}
        <Command>
          <ScrollArea
            onScrollEndViewPort={onScrollEnd}
            className="combobox-selector"
            style={{ minWidth: buttonWidth() + "px", maxWidth: "500px" }}
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
                        __value && __value.includes(item.value)
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

export default memo(ComboboxMulti);
