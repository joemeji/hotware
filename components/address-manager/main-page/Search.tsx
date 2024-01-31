import { Input } from "@/components/ui/input";

export const Search = () => {
  return (
    <>
      <form id="Search" className="max-w-[400px] w-full">
        <Input
          type="search"
          placeholder="Search"
          className="rounded-xl placeholder:text-stone-400"
          name="search"
        />
      </form>
    </>
  );
};
