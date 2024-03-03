import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";

const TextBlockList = (props: TextBlockListProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue } = props;

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [session?.user?.access_token && "/api/text_blocks", session?.user?.access_token]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  return (
    <div className="flex flex-col">
      {data?.map((textBlock: any) => (
        <>
          {textBlock.text_block_title ? (
            <div
              className={`border border-[#ddd] py-2.5 px-4 cursor-pointer ${
                value === textBlock.text_block_id
                  ? "bg-[#33d3d3] text-white"
                  : ""
              }`}
              onClick={() => onChangeValue && onChangeValue(textBlock)}
            >
              {textBlock.text_block_title}
            </div>
          ) : null}
        </>
      ))}
    </div>
  );
};

type TextBlockListProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default TextBlockList;
