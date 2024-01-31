import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { SignatorySelect } from "../../form-elements/SignatorySelect";
import { LetterDocumentTypeSelect } from "../../form-elements/LetterDocumentTypeSelect";
import LetterLists from "../../lists/LetterLists";
import LetterButtonExport from "../../form-elements/LetterButtonExport";
import { memo, useState } from "react";
import { LetterEmployeeSelect } from "../../form-elements/LetterEmployeeSelect";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LetterClientSelect } from "../../form-elements/LetterClientSelect";
import { LetterCountrySelect } from "../../form-elements/LetterCountrySelect";
import { Button } from "@/components/ui/button";
import { LetterClientLocation } from "../../form-elements/LetterClientLocation";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { LetterLanguageSelect } from "../../form-elements/LetterLanguageSelect";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { Plus } from "lucide-react";
import { automatedLetterSchema } from "../../schema";
import { format as __fnsFormat } from "date-fns";

const AutoMattedLetters = ({}) => {
  const [documentType, setDocumentType] = useState("gl");
  const [dateFrom, setDateFrom] = useState(
    __fnsFormat(new Date(), "yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(__fnsFormat(new Date(), "yyyy-MM-dd"));
  const [userDetails, setUserDetails] = useState<any>();

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(automatedLetterSchema),
  });

  const getUserDetails = async (id: string) => {
    const res = await fetch(`/api/user/details?userId=${id}`);
    const info = await res.json();

    setValue("designation", info && info?.user_job_title);
    setValue("employee_type", info && info?.user_employed_type);
  };

  const createLetter = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/letter/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        mutate(
          `/api/letter/lists?type=${documentType}&from=${dateFrom}&to=${dateTo}`
        );
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <form action="" method="post" onSubmit={handleSubmit(createLetter)}>
      <div className="grid grid-cols-12 gap-5 py-5">
        <div className="flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4">
          <label className="font-medium">Document Type</label>
          <Controller
            name="letter_type"
            control={control}
            defaultValue="gl"
            render={({ field }) => (
              <LetterDocumentTypeSelect
                onChangeValue={(value: any) => {
                  field.onChange(value);
                  setDocumentType(value);
                }}
                value={field.value}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-3 col-span-5 xl:col-span-3 md-col-span-4">
          <label className="font-medium">Signatory</label>
          <Controller
            name="signatory"
            control={control}
            render={({ field }) => (
              <SignatorySelect
                onChangeValue={(value: any) => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </div>
      </div>
      <div className="border border-4 border-solid rounded-3xl hover:border-red-200 hover:border-dashed p-10 ">
        <section className="fields grid grid-cols-12 gap-8  border-b-4 pb-5">
          <div className="col-span-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Employee</label>
              <Controller
                name="employee"
                control={control}
                render={({ field }) => (
                  <LetterEmployeeSelect
                    placeholder="--Select Employee--"
                    onChangeValue={(value: any) => {
                      field.onChange(value);
                      getUserDetails(value);
                    }}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["cl", "ia", "dwm", "wo", "sc", "wus"].includes(
                documentType
              ),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Employee Type</label>
              <Input
                defaultValue={
                  userDetails ? userDetails?.user_employed_type : ""
                }
                className="bg-stone-100 border-transparent"
                error={errors && (errors.employee_type ? true : false)}
                {...register("employee_type")}
              />
            </div>
          </div>
          <div
            className={cn(
              "col-span-3",
              { hidden: ["wc"].includes(documentType) },
              {
                inline: [
                  "gl",
                  "gel",
                  "cl",
                  "ia",
                  "dwm",
                  "wo",
                  "sc",
                  "wus",
                ].includes(documentType),
              }
            )}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Designation</label>
              <Input
                className="bg-stone-100 border-transparent"
                defaultValue={userDetails ? userDetails?.user_job_title : ""}
                error={errors && (errors.designation ? true : false)}
                {...register("designation")}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["ia", "dwm", "sc", "wus"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Identity</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.identity ? true : false)}
                {...register("identity")}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["ia", "dwm", "wo", "sc", "wus"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Language</label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <LetterLanguageSelect
                    // placeholder='--Select Employee--'
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn(
              "col-span-3",
              {
                hidden: ["wc", "ia", "dwm", "wo", "sc", "wus"].includes(
                  documentType
                ),
              },
              {
                inline: ["gl", "gel", "cl", "default"].includes(documentType),
              }
            )}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Client</label>
              <Controller
                name="client"
                control={control}
                render={({ field }) => (
                  <LetterClientSelect
                    // placeholder='--Select Employee--'
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["cl"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Client Location</label>
              <Controller
                name="client_location"
                control={control}
                render={({ field }) => (
                  <LetterClientLocation
                    // placeholder='--Select Employee--'
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["wc"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Start Date</label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                    date={field.value ? new Date(field.value) : undefined}
                    onChangeDate={(date) => field.onChange(date)}
                    format="dd-MM-yyyy"
                    error={errors && errors.start_date}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["cl", "wc"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Return date</label>
              <Controller
                name="return_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                    date={field.value ? new Date(field.value) : undefined}
                    onChangeDate={(date) => field.onChange(date)}
                    format="dd-MM-yyyy"
                    error={errors && errors.return_date}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["cl"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Purpose</label>
              <Input
                defaultValue={`${
                  ["cl"].includes(documentType)
                    ? "Technical Support, Discussion, and Training"
                    : ""
                }`}
                className="bg-stone-100 border-transparent"
                error={errors && (errors.purpose ? true : false)}
                {...register("purpose")}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["cl"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Job</label>
              <Input
                defaultValue={`${
                  ["cl"].includes(documentType)
                    ? "furnace control during start-up"
                    : ""
                }`}
                className="bg-stone-100 border-transparent"
                error={errors && (errors.job ? true : false)}
                {...register("job")}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3 ", {
              inline: ["cl", "itr"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Embassy</label>
              <Textarea
                className="bg-stone-100 border-transparent"
                error={errors && (errors.embassy ? true : false)}
                {...register("embassy")}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["dwm", "sc"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">
                {documentType === "dwm" && `Absence (From)`}
                {documentType === "sc" && `Salary Reduction (From)`}
              </label>
              <Controller
                name="letter_date_from"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                    date={field.value ? new Date(field.value) : undefined}
                    onChangeDate={(date) => field.onChange(date)}
                    format="dd-MM-yyyy"
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn("hidden col-span-3", {
              inline: ["dwm", "sc"].includes(documentType),
            })}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">
                {documentType === "dwm" && `Absence (To)`}
                {documentType === "sc" && `Salary Reduction (To)`}
              </label>
              <Controller
                name="letter_date_to"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                    date={field.value ? new Date(field.value) : undefined}
                    onChangeDate={(date) => field.onChange(date)}
                    format="dd-MM-yyyy"
                  />
                )}
              />
            </div>
          </div>
          <div
            className={cn(
              "col-span-3",
              {
                hidden: ["cl", "ia", "dwm", "wo", "sc", "wus"].includes(
                  documentType
                ),
              },
              {
                inline: ["gl", "gel", "wc", ""].includes(documentType),
              }
            )}
          >
            <div className="flex flex-col gap-3">
              <label className="font-medium">Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <LetterCountrySelect
                    // placeholder='--Select Employee--'
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div className="self-end col-span-1">
            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-400">
              <Plus size={16} strokeWidth={2.25} absoluteStrokeWidth />
              Add
            </Button>
          </div>
        </section>
        <div className="grid grid-cols-12 gap-5 py-5">
          <div className="flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4">
            <label className="font-medium">From</label>
            <Controller
              name="date_from"
              control={control}
              render={({ field }) => (
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                  date={field.value ? new Date(field.value) : new Date()}
                  onChangeDate={(date: any) => {
                    field.onChange(date);
                    setDateFrom(__fnsFormat(date, "yyyy-MM-dd"));
                  }}
                  format="dd-MM-yyyy"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4">
            <label className="font-medium">To</label>
            <Controller
              name="date_to"
              control={control}
              render={({ field }) => (
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                  date={field.value ? new Date(field.value) : new Date()}
                  onChangeDate={(date: any) => {
                    field.onChange(date);
                    setDateTo(__fnsFormat(date, "yyyy-MM-dd"));
                  }}
                  format="dd-MM-yyyy"
                />
              )}
            />
          </div>
        </div>
        <LetterLists
          categoryType={documentType}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
      <LetterButtonExport
        type={documentType}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </form>
  );
};

export default memo(AutoMattedLetters);
