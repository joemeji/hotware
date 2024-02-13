import { memo, useState } from "react";
import path from "path";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InputFile = {
  onChange?: (files: File[]) => void;
  id?: string | undefined;
  name?: string | undefined;
  accept?: string | undefined;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean
};

const InputFile = ({ onChange, id, name, accept, multiple, required, disabled }: InputFile) => {
  const [files, setFiles] = useState<any>(null);
  const [inputFile, setInputFile] = useState<any>(null);

  const _onChangeFile = (e: any) => {
    const _files: any = [];

    if (e.target.files) {
      Array.from(e.target.files).forEach((file: any) => {
        const name = path.parse(file.name).name;
        const ext = path.parse(file.name).ext;

        file.displayName = name;
        file.ext = ext;

        _files.push(file);
      });
    }
    onChange && onChange(_files);
    setFiles(_files);
  };

  const onReset = () => {
    if (inputFile) inputFile.value = "";
    onChange && onChange([]);
    setFiles([]);
  };

  return (
    <div
      className={cn(
        "bg-stone-100 py-2 rounded-app px-2 items-center flex gap-2 relative justify-between"
      )}
    >
      <input
        id={id || "file_input"}
        type="file"
        multiple={multiple}
        onChange={_onChangeFile}
        accept={accept}
        name={name}
        ref={(el) => setInputFile(el)}
        required={required}
        disabled={disabled}
      />

      {files && files.length > 0 && (
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className="opacity-60 hover:opacity-100 cursor-pointer"
                onClick={onReset}
              >
                <X width={18} height={18} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default memo(InputFile);

function returnFileSize(number: number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}
