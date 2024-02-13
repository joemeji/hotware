import { Book } from "lucide-react";

type CreateBookButtonParams = {
  isBooked: boolean;
  onBook: any;
  onUnbook: any;
};

export const CreateBookButton = ({
  isBooked,
  onBook,
  onUnbook,
}: CreateBookButtonParams) => {
  if (isBooked) {
    return (
      <div
        onClick={onUnbook}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <Book className="w-[18px] h-[18px] text-indigo-500" />
        <span className="text-sm font-medium">
          Unbook <span className="text-xs">(Accounting)</span>
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onBook}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <Book className="w-[18px] h-[18px] text-indigo-500" />
      <span className="text-sm font-medium">
        Book <span className="text-xs">(Accounting)</span>
      </span>
    </div>
  );
};
