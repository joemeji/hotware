"use client"

import AdminLayout from "@/components/admin-layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ReportForm from "@/components/items/item-certification/form/report-form";
import VerifiedPlates from "@/components/items/item-certification/form/verified-plates";
import Isolation from "@/components/items/item-certification/form/isolation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Signature from "@/components/items/item-certification/form/signature";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";

const defaultIsolationValue = {
  form_isolation_voltage: '1000VDC',
  form_isolation_resistance: 'Up to 240V = 0,2MΩ / up to 600V = 0,5MΩ',
  form_isolation_device: null,
  form_isolation_l1: null,
  form_isolation_l2: null,
  form_isolation_l3: null,
  form_isolation_function_safety: null,
  form_isolation_remarks: null,
};

export default function Form({ equipmentDetails, formImageSvg, formData: _formData, access_token }: any) {
  const formImageRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<any>(null);
  const formHeaderRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<any>([]);
  const [formPlates, setFormPlates] = useState<any>([]);
  const [isolationValues, setIsolationValues] = useState<any>({ ...defaultIsolationValue });
  const [loadingSaveBtn, setLoadingSaveBtn] = useState(false);
  const [placeValue, setPlaceValue] = useState<any>(null);
  const router = useRouter();

  const onClickImageProtocol = (e: any) => {
    if (e.target.nodeName === 'circle' || e.target.nodeName === 'path') {
      const id = e.target?.getAttribute('id');
      if (id) {
        const idValue = Number(id.split('num-')[1]);
        const index = !isNaN(idValue) ? idValue - 1 : 0;
        const { current: container } = formData.datas[index].containerRef;
        const { current: formHeader } = formHeaderRef;
        window.scroll({
          top: (
            Math.round((Number(container?.getBoundingClientRect().top) + document.documentElement.scrollTop)) 
            - (formHeader?.offsetHeight || 0)
            - 80
          ),
          behavior: 'smooth'
        });
      }
    }
  };

  const onSaveMaintenanceReport = async () => {
    setLoadingSaveBtn(true);
    try {
      const body = JSON.stringify({
        report_form_data: formValues,
        form_plates: formPlates,
        isolation: isolationValues,
        signature_place: placeValue,
        form_id: router.query.form,
        item_ref_id: router.query.itemId ? router.query.itemId[0] : null,
        item_ref_type: router.query.itemId ? router.query.itemId[1] : null,
      });
      const options = {
        method: 'POST',
        body,
        headers: { ...authHeaders(access_token) }
      };
      const res = await fetch(baseUrl + '/api/forms/save_form_data', options);
      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Item certification successfully created.",
          variant: 'success',
          duration: 4000
        });
        setFormValues(defaultFormDataValues());
        setFormPlates(defaultFormPlates());
        setIsolationValues(defaultIsolationValue);
        setPlaceValue(defaultPlaceValue());
      }
      setLoadingSaveBtn(false);
    }
    catch(err: any) {
      setLoadingSaveBtn(false);
      console.log('Error: ' + err.messsage);
      toast({
        title: "Internal Server Error",
        description: 'The server encountered an error and could not complete your request.',
        variant: 'destructive',
        duration: 10000
      });
    }
  };

  const backLink = () => {
    if (equipmentDetails) {
      if (equipmentDetails.serial_number_id) {
        return `/items/item-certification/${equipmentDetails._serial_number_id}/sn`;
      } else {
        return `/items/item-certification/${equipmentDetails._item_id}/equipment`;
      }
    }
    return window.history.back();
  }

  const defaultFormDataValues = useCallback(() => {
    if (formData && formData.datas) {
      const _formDataValues = [...formData.datas].map((formData: any) => {
        return {
          form_sub_category_id: formData.form_sub_category_id,
          form_datas: formData.form_datas && formData.form_datas.map((data: any) => ({
            form_data_id: data.form_data_id,
            form_report_data_status: null,
            form_report_data_remarks: null,
          })),
        }
      });
      return _formDataValues;
    }
    return [];
  }, [formData]);

  const defaultFormPlates = useCallback(() => {
    if (formData && formData.form_plates) {
      const _formPlates = [...formData.form_plates].map((plate: any) => {
        return {
          plates_id: plate.plates_id,
          included: false,
        }
      });
      return _formPlates;
    }
    return [];
  }, [formData]);

  const defaultPlaceValue = useCallback(() => {
    if (formData && formData.form_signature) {
      return (
        (formData.form_signature.cms_address_building ? formData.form_signature.cms_address_building + ', ' : '')
        + (formData.form_signature.cms_address_street ? formData.form_signature.cms_address_street + ', ' : '')
        + (formData.form_signature.country_name + ', ')
        + (formData.form_signature.cms_address_zip || '')
      );
    }
  }, [formData]);

  useEffect(() => {
    if (_formData) {
      if (_formData.datas && Array.isArray(_formData.datas)) {
        const formDatas = _formData.datas;
        const datas = formDatas.map((data: any) => ({
          ...data,
          containerRef: React.createRef<HTMLDivElement>()
        }));

        _formData.datas = datas;
        setFormData(_formData);
      }
    }
  }, [_formData]);

  useEffect(() => {
    setFormValues(defaultFormDataValues());
  }, [defaultFormDataValues]);

  useEffect(() => {
    setFormPlates(defaultFormPlates());
  }, [defaultFormPlates]);

  useEffect(() => {
    setPlaceValue(defaultPlaceValue());
  }, [defaultPlaceValue]);

  return ( 
    <AdminLayout>
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="flex px-[25px] gap-[25px]">
          <div className="w-[70%] py-[25px]">
            <div className="bg-white/80 backdrop-blur p-4 pb-0 rounded-tl-xl rounded-tr-xl sticky top-[var(--header-height)]"
              ref={formHeaderRef}
            >
              <div className="flex items-center gap-2 pb-4">
                <Link href={backLink() || '/'}>
                  <Button 
                    className={cn("p-2.5")} 
                    variant="ghost"
                  >
                    <ArrowLeft className="text-stone-500" />
                  </Button>
                </Link>
                <span className="flex justify-center text-lg">
                  {_formData && _formData.form_details && _formData.form_details.form_certificate}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-t-stone-100 py-4">
                <div className="flex flex-col">
                  <span className="text-lg text-stone-700 font-medium">
                    {equipmentDetails && equipmentDetails.item_name}
                  </span>
                  <span className="text-lg text-stone-500 font-medium">
                    {equipmentDetails 
                      && equipmentDetails.item_sub_category_index 
                      && equipmentDetails.item_number 
                      && equipmentDetails.item_sub_category_index + equipmentDetails.item_number + '.000'}
                    {equipmentDetails && equipmentDetails.serial_number}
                  </span>
                </div>
                <Button onClick={onSaveMaintenanceReport} 
                  className={cn(loadingSaveBtn && 'loading')}
                  disabled={loadingSaveBtn}
                >Save Changes</Button>
              </div>
            </div>
            <div className="bg-white rounded-bl-xl rounded-br-xl shadow-sm pb-4">
              <Tabs defaultValue="report-form" className="w-full">
                <TabsList className="w-full h-auto py-2 rounded-none gap-2">
                  <TabsTrigger 
                    className={cn(
                      "py-1 rounded-full text-stone-600 bg-stone-100",
                      "data-[state=active]:bg-white data-[state=active]:border-white" 
                    )}
                    value="report-form">Report Form</TabsTrigger>
                  <TabsTrigger 
                    className={cn(
                      "py-1 rounded-full text-stone-600 bg-stone-100",
                      "data-[state=active]:bg-white data-[state=active]:border-white" 
                    )}
                    value="verified-plates">Verified Plates</TabsTrigger>
                  <TabsTrigger 
                    className={cn(
                      "py-1 rounded-full text-stone-600 bg-stone-100",
                      "data-[state=active]:bg-white data-[state=active]:border-white" 
                    )}
                    value="isolation">Isolation</TabsTrigger>
                  <TabsTrigger 
                    className={cn(
                      "py-1 rounded-full text-stone-600 bg-stone-100",
                      "data-[state=active]:bg-white data-[state=active]:border-white" 
                    )}
                    value="signature">Signature</TabsTrigger>
                </TabsList>
                <TabsContent value="report-form" className="p-4">
                  <ReportForm 
                    formData={formData} 
                    formValues={formValues}
                    onChangeFormValues={(formValues: any) => setFormValues(formValues)}
                  />
                </TabsContent>
                <TabsContent value="verified-plates" className="p-4">
                  <VerifiedPlates 
                    formData={formData} 
                    formPlates={formPlates}
                    onChangeFormPlates={(formPlates: any) => setFormPlates(formPlates)}
                  />
                </TabsContent>
                <TabsContent value="isolation" className="p-4">
                  <Isolation 
                    isolationValues={isolationValues}
                    onChangeIsolationValues={(isolationValues: any) => setIsolationValues(isolationValues)}
                  />
                </TabsContent>
                <TabsContent value="signature" className="p-4 pb-3">
                  <Signature
                    placeValue={placeValue}
                    onChangePlaceValue={(placeValue: any) => setPlaceValue(placeValue)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div 
            className={cn(
              "w-[30%] bg-white h-[calc(100vh-var(--header-height)-50px)] sticky mt-[25px] top-[calc(var(--header-height)+25px)] rounded-xl p-4",
              "shadow-sm"
            )}
          >
            <div 
              ref={formImageRef}
              className="form-image w-full h-full relative" 
              onClick={onClickImageProtocol}
              dangerouslySetInnerHTML={{ __html: formImageSvg }} 
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const itemId: any = context.query.itemId;
  const session = await getServerSession( context.req, context.res, authOptions );
  let token  = null;
  let equipmentDetails = null;
  let formImageSvg = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const fetchOption = {
    headers: { ...authHeaders(token) }
  };

  const id = itemId[0];

  if (itemId[1] && itemId[1] === 'sn') {
    const res = await fetch(baseUrl + '/api/items/serial_number/' + id, { ...fetchOption });
    const json = await res.json();

    if (json) {
      equipmentDetails = json;
    }
  }

  if (itemId[1] && itemId[1] === 'equipment') {
    const res = await fetch(baseUrl + `/api/items/${id}/equipment`, { ...fetchOption });
    const json = await res.json();

    if (json) {
      equipmentDetails = json;
    }
  }

  if (!equipmentDetails || !context.query.form) {
    // replace with page not found
    return {
      redirect: {
        destination: '/items',
        permanent: false,
      },
    }
  }

  const resFormData = await fetch(
    baseUrl + `/api/forms/form_data/form_id=${context.query.form}/ref_id=${id}/${itemId[1]}`, 
    { ...fetchOption }
  );
  let formData = await resFormData.json();

  if (formData && formData.form_details) {
    let resImage = await fetch(baseUrl + `/form_images_svg/${formData.form_details.form_type}.svg`, { ...fetchOption });
    formImageSvg = await resImage.text();
  }

  return {
    props: {
      equipmentDetails: equipmentDetails,
      formImageSvg: formImageSvg,
      formData,
      access_token: token
    }
  }
}
