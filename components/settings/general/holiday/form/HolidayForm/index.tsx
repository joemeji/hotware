
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { useEffect, useState } from "react";
import { countrySchema } from "../../schema";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/datepicker";
import { RepetitionSelect } from "../../elements/RepetitionSelect";
import { HolidayCountrySelect } from "../../elements/HolidayCountrySelect";
import { format as __fnsFormat } from "date-fns"

interface IHolidayForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const HolidayForm = (props : IHolidayForm) => {

  const {id, listUrl, onOpenChange} = props

  const {data, isLoading} = useSWR(id ? `/api/holiday/info?id=${id}` : null , fetcher)

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
    control 
  } = useForm({
    resolver: yupResolver(countrySchema()),
    defaultValues: {
      holiday_date: __fnsFormat(new Date(), 'yyyy-MM-dd'),
    }
  });

  const countries = data?.country_ids?.toString()?.split(',')

  const submit = async (data: any) => {
    console.log('data', data)

    try {
      const payload = {
        ...data
      };

      const url = id ? '/api/holiday/update' : '/api/holiday/create'

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {

        toast({
          title: id ? "Successfully Updated." : 'Successfully Added.',
          variant: 'success',
          duration: 4000
        });

        mutate(listUrl)

        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);


        if (onOpenChange) {
          onOpenChange(false);
        }

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }


    } catch { }
  }

  useEffect(() => {
    if (!id) {
      reset()
    } else {
      setValue('holiday_name', data?.holiday_name)
      setValue('holiday_date', data?.holiday_date ?? null )
      setValue('country_all', data?.country_id == '0' ? true : false )
      setValue('holiday_every_year', data?.holiday_every_year ?? 0)
      setValue('countries', countries)
    }

  }, [data, countries, id, reset, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Name'
          disabled={isLoading}
          error={errors && (errors.holiday_name ? true : false)}
          {...register("holiday_name")}
        />
        {errors?.holiday_name && (
          <small className='text-red-500'>{errors?.holiday_name.message}</small>
        )}
      </div>
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Date</label>
        <Controller
          name='holiday_date'
          control={control}
          render={({ field }) => (
            <DatePicker
              placeholder='yyyy-mm-dd'
              triggerClassName='bg-stone-100 w-full py-2 px-3 rounded-md items-center'
              date={field.value ? new Date(field.value) : new Date()}
              onChangeDate={(date) => {
                field.onChange(date);
                setValue('holiday_date', __fnsFormat(date as Date,  'yyyy-MM-dd') )
              }}
              format='yyyy-MM-dd'
            />
          )}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex justify-between items-center'>
          <label className='font-medium'>Country</label>
          <div className='flex gap-1 items-center px-4'>
            <Input
              type='checkbox'
              className='bg-stone-100 border-transparent'
              {...register("country_all")}
            />
            All
          </div>
        </div>
        <Controller
          control={control}
          name='countries'
          render={({ field }) => (
            <HolidayCountrySelect
              onChangeValue={(value: any) => {
                field.onChange(value)
              }}
              value={field.value}
              defaultValue={countries}
            />
          )}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Repition</label>
        <Controller
          control={control}
          name='holiday_every_year'
          defaultValue={data?.holiday_every_year ?? '0'}
          render={({ field }) => (
            <RepetitionSelect
              onChangeValue={(value: any) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
}