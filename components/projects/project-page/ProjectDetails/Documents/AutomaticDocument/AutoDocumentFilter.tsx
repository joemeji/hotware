import ApiDocumentLanguageSelect from "@/components/app/api-document-language-select";
import DocumentCategorySelect from "@/components/app/document-category-select";
import RequirementLevelSelect from "@/components/app/requirement-level-select";
import { DocumentTypeSelect } from "@/components/settings/cms/requirement-level/elements/DocumentTypeSelect";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

export function document_type_format(document_type_name?: any) {
  let document_type: any;

  if (typeof document_type_name === "string") {
    document_type = document_type_name.toLowerCase();

    if (document_type.includes("equipment")) document_type = "equipment";

    return document_type;
  }
}

export default function AutoDocumentFilter({
  onChangeFilter,
  filterValue,
}: {
  onChangeFilter?: ({
    requirement_level,
    document_type,
    document_category,
    language,
  }: {
    requirement_level?: any;
    document_type?: any;
    document_category?: any;
    language?: any;
  }) => void;
  filterValue?: {
    requirement_level?: any;
    document_type?: any;
    document_category?: any;
    language?: any;
  };
}) {
  let _filterValue = filterValue || {};

  let document_type = document_type_format(
    filterValue?.document_type?.document_type_name
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="py-1.5 flex items-center gap-2 px-3"
          variant={"ghost"}
        >
          <Filter className="w-[18px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-base font-medium mb-3">Filter</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label>Requirement Level</label>
            <RequirementLevelSelect
              onChangeReqLevel={(level) => {
                onChangeFilter &&
                  onChangeFilter({
                    ..._filterValue,
                    requirement_level: level,
                  });
              }}
              value={filterValue?.requirement_level?.document_level_id}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Document Type</label>
            <DocumentTypeSelect
              onChangeDocType={(docType) => {
                onChangeFilter &&
                  onChangeFilter({
                    ..._filterValue,
                    document_type: docType,
                  });
              }}
              value={filterValue?.document_type?.document_type_id}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Document Category</label>
            <DocumentCategorySelect
              onChangeDocCategory={(docCate) => {
                onChangeFilter &&
                  onChangeFilter({
                    ..._filterValue,
                    document_category: docCate,
                  });
              }}
              value={filterValue?.requirement_level?.document_category_id}
              document_type={document_type}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Language</label>
            <ApiDocumentLanguageSelect
              onChangeDocLang={(docLang) => {
                onChangeFilter &&
                  onChangeFilter({
                    ..._filterValue,
                    language: docLang,
                  });
              }}
              value={filterValue?.language?.document_language_id}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
