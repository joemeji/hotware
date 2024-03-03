import { Input } from "@/components/ui/input";

export const Search = ({ onKeyUp }: { onKeyUp?: (evt: any) => void }) => {
  return (
    <>
      {/* <form id="Search" className="max-w-[400px] w-full"> */}
      <Input
        type="search"
        placeholder="Search"
        className="rounded-xl placeholder:text-stone-400 max-w-[400px] w-full"
        name="search"
        onChange={(evt?: any) => onKeyUp && onKeyUp(evt.target.value)}
      />
      {/* </form> */}
    </>
  );
};
