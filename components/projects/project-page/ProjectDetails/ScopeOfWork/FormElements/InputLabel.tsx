import Combobox from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { forwardRef, memo } from "react";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: any;
  suffix?: any;
}

export const PostInputLabel = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, suffix, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label style={{ display: label ? "block" : "none" }}>{label}</label>
        <>
          <div
            className={cn(
              "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
            )}
          >
            <input
              type={type}
              className={cn(
                "px-3 py-2.5 text-sm bg-transparent outline-none w-full",
                error &&
                  "ring-2 ring-offset-2 ring-red-300 focus-visible:ring-red-300",
                className
              )}
              ref={ref}
              {...props}
            />
            <span className="font-medium text-stone-500">{suffix}</span>
          </div>
        </>
      </div>
    );
  }
);
PostInputLabel.displayName = "Input";

export const InputLabel = (props: InputLabelProps) => {
  const { label, suffix, placeholder, _value, readonly, disabled } = props;

  const numericValue = Number(_value);
  const formattedValue = isNaN(numericValue)
    ? ""
    : numericValue.toLocaleString();

  return (
    <>
      <div className="flex flex-col gap-2">
        <label>{label}</label>
        <>
          <div
            className={cn(
              "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
            )}
          >
            <input
              placeholder={placeholder}
              className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
              defaultValue={formattedValue}
              readOnly={readonly}
              disabled={disabled}
            />
            <span className="font-medium text-stone-500">{suffix}</span>
          </div>
        </>
      </div>
    </>
  );
};

type InputLabelProps = {
  label?: any;
  suffix?: any;
  placeholder?: any;
  _value?: any;
  readonly?: any;
  disabled?: any;
};

export const InputSuffix = (props: InputSuffixProps) => {
  const { suffix, placeholder, _value, readonly, disabled } = props;

  const numericValue = Number(_value);
  const formattedValue = isNaN(numericValue)
    ? ""
    : numericValue.toLocaleString();

  return (
    <>
      <div className="flex flex-col gap-2">
        <>
          <div
            className={cn(
              "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
            )}
          >
            <input
              placeholder={placeholder}
              className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
              defaultValue={formattedValue}
              readOnly={readonly}
              disabled={disabled}
            />
            <span className="font-medium text-stone-500">{suffix}</span>
          </div>
        </>
      </div>
    </>
  );
};

type InputSuffixProps = {
  suffix?: any;
  placeholder?: any;
  _value?: any;
  readonly?: any;
  disabled?: any;
};

export const InputSuffixPost = forwardRef(
  (props: InputSuffixPostProps, ref) => {
    const {
      suffix,
      placeholder,
      readonly,
      disabled,
      value,
      onChangeValue,
      type,
    } = props;

    const numericValue = Number(value);
    const formattedValue = isNaN(numericValue)
      ? ""
      : numericValue.toLocaleString();

    return (
      <>
        <div className="flex flex-col gap-2">
          <>
            <div
              className={cn(
                "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
              )}
            >
              <input
                placeholder={placeholder}
                className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
                readOnly={readonly}
                disabled={disabled}
                value={formattedValue}
                onChange={(value: any) => onChangeValue && onChangeValue(value)}
              />
              <span className="font-medium text-stone-500">{suffix}</span>
            </div>
          </>
        </div>
      </>
    );
  }
);

InputSuffixPost.displayName = "InputSuffixPost";

type InputSuffixPostProps = {
  suffix?: any;
  placeholder?: any;
  _value?: any;
  readonly?: any;
  disabled?: any;
  value?: any;
  onChangeValue?: (value: any) => void;
  type?: any;
};

export const SelectSuffix = forwardRef((props: SelectSuffixProps, ref) => {
  const {
    suffix,
    placeholder,
    _value,
    readonly,
    disabled,
    onChangeValue,
    value,
    label,
    rate,
  } = props;

  let data: any;

  switch (rate) {
    case "hour":
      data = hourRate;
      break;
    case "day":
      data = dayRate;
      break;
    case "eqpRent":
      data = eqpRentRate;
      break;
    case "eqpMaintenance":
      data = eqpMaintenanceRate;
      break;
    case "eqpPacking":
      data = eqpMaintenanceRate;
      break;
    default:
      break;
  }

  const contentData = () => {
    return (
      data &&
      data.map((rate: any) => {
        return {
          text: (
            <div className="flex flex-col">
              <span className="font-medium">{rate.value}</span>
            </div>
          ),
          value: rate.value,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label style={{ display: label ? "block" : "none" }}>{label}</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <Combobox
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full h-10"
          value={value}
          onChangeValue={onChangeValue}
          contents={contentData()}
        />
        <span className="font-medium text-stone-500">{suffix}</span>
      </div>
    </div>
  );
});

SelectSuffix.displayName = "SelectSuffix";

type SelectSuffixProps = {
  suffix?: any;
  placeholder?: any;
  _value?: any;
  readonly?: any;
  disabled?: any;
  onChangeValue?: any;
  value?: any;
  label?: any;
  rate?: any;
};

export const hourRate = [0, 5, 10, 15, 20, 25, 30, 35].map((rate) => ({
  value: rate,
}));

export const dayRate = [
  120, 150, 200, 220, 250, 280, 300, 320, 350, 450, 550, 650, 750,
].map((value) => ({ value }));

export const eqpRentRate = [
  0, 8, 25, 35, 50, 60, 75, 90, 100, 200, 800, 1000,
].map((value) => ({ value }));

export const eqpMaintenanceRate = [
  25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 90, 100, 110, 120, 130, 140, 150,
].map((value) => ({ value }));
