import _ from "lodash";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchInput = ({
  width = 300,
  onChange,
  value,
  delay = 300,
  placehoder = "Search",
}: {
  width?: any;
  onChange?: (e?: any) => void;
  value?: any;
  delay?: number;
  placehoder?: any;
}) => {
  const [_value, setValue] = useState<any>(value);

  const _onChange = _.debounce((e) => {
    onChange && onChange(e);
  }, delay);

  return (
    <div
      className="bg-stone-100 flex items-center rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2 w-full"
      style={{
        width: width + "px",
      }}
    >
      <Search className="text-stone-400 w-5 h-5" />
      <input
        placeholder={placehoder}
        type="search"
        className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full"
        name="search"
        style={{
          maxWidth: width + "px",
        }}
        onChange={(e) => {
          _onChange(e);
          setValue(e.target.value);
        }}
        value={_value || ""}
      />
    </div>
  );
};

export default SearchInput;
