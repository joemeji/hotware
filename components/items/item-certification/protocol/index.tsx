import '@splidejs/react-splide/css/core';
import '@splidejs/react-splide/css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { step1To7Contents, step8To10Contents } from "@/data/ventilatorData";
import StepsNav from "@/components/items/item-certification/steps-nav";
import Step1To7 from "@/components/items/item-certification/steps1to7";
import Step8To10Content from "@/components/items/item-certification/steps8to10";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronsDown, Frown } from "lucide-react";
import { CSSTransition } from 'react-transition-group';
import { useRouter } from 'next/router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { stepContents } from '@/data/edbChineseData';
import { stepContents as edbMushroomStepContents } from '@/data/edbMushroomData';
import Link from 'next/link';

function protocolStepsContent(formType: string) {
  if (formType === 'pump_oil') return [];
  if (formType === 'gas_safety_skid') return [];
  if (formType === 'oil_safety_skid') return [];
  if (formType === 'gas_burner') return [];
  if (formType === 'oil_burner') return [];
  if (formType === 'oil_burner') return [];
  if (
    formType === 'combusion_ka_15' 
    || formType === 'combustion_ka_15' 
    || formType === 'combustion_ch_7_5' 
    || formType === 'combustion_ch_15' 
    || formType === 'combustion_london_15'
  ) return [...step1To7Contents, ...step8To10Contents];
  if (formType === 'edb_ch_chinese') return [...stepContents];
  if (formType === 'edb_ch_mushroom') return [...edbMushroomStepContents];
  return [];
}

const Protocol = React.forwardRef(({ equipmentDetails, forms, access_token, userSelectedForm }: any, ref: any) => {
  const [stepSelectedIndex, setSelectedIndex] = useState(0);
  const [indices, setIndices] = useState<number[]>([0]);
  const stepnavRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const getForm = useCallback(() => {
    const form_id = router.query.form;
    if (form_id) return forms?.find((item: any) => item.form_id === form_id);
    return null;
  }, [router, forms]);

  const onChangeFormSelect = (value: any) => {
    const form = forms?.find((item: any) => item.form_id == value);
    setSelectedForm(form);
    if (form && Number(form.has_form_created) === 1) {
      setSelectedFormId(selectedFormId);
      setSelectedFormId(value);
      router.query.show_protocol = '1';
      router.query.form = form.form_id;
      router.push(router);
      setIndices([0]);
      setSelectedIndex(0);
    }
  };

  const onClickStep = (stepIndex: number) => {
    setSelectedIndex(stepIndex);
    scrollStep(stepIndex);
  };

  const onClickNextSteps = () => {
    const _indices = [...indices];
    const lastIndex = _indices[_indices.length - 1];
    _indices.push(lastIndex + 1);
    setIndices(_indices);
    setSelectedIndex(lastIndex + 1);
  };

  const currentStepContentShowing = useCallback(() => {
    const _stepsContent = [];
    const stepsContentData = protocolStepsContent(getForm().form_type);
    if (stepsContentData.length > 0) {
      for (let i = 0; i < indices.length; i++) {
        _stepsContent.push(stepsContentData[indices[i]]);
      }
    }
    return _stepsContent;
  }, [indices, getForm]);

  const scrollStep = useCallback((stepIndex: number) => {
    if (currentStepContentShowing()[stepIndex]) {
      const { current } = currentStepContentShowing()[stepIndex].stepRef;
      window.scroll({
        top: Math.round((Number(current?.getBoundingClientRect().top) + document.documentElement.scrollTop)) - 80,
        behavior: 'smooth'
      });
    }
  }, [currentStepContentShowing]);

  useEffect(() => {
    if (getForm()) {
      setSelectedFormId(getForm()?.form_id);
    }
  }, [getForm]);

  useEffect(() => {
    scrollStep(stepSelectedIndex);
  }, [scrollStep, stepSelectedIndex]);

  useEffect(() => {
    if (userSelectedForm && userSelectedForm.done_reviewing_protocol) {
      if (getForm() && getForm().form_id) {
        const _protocolStepsContent = protocolStepsContent(getForm().form_type);
        const _indices: any = [];
        for (let i=0; i < _protocolStepsContent.length; i++) {
          _indices.push(i);
        }
        setIndices(_indices);
      }
    }
  }, [userSelectedForm, getForm]);

  return (
    <>
      <AlertDialog open={selectedForm && Number(selectedForm.has_form_created) === 0}>
        <AlertDialogContent className="border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 border-b pb-3">
              <span className="p-1 bg-orange-100 rounded-full">
                <Frown />
              </span>
              <span>No Form Found</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              As of now, no form has been generated for the {selectedForm && selectedForm.form_description}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedForm(null)} 
              className="bg-stone-800 text-white hover:bg-stone-700 hover:text-white"
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full max-w-[1600px] mx-auto" ref={ref}>
        <div className="flex px-[25px] gap-[25px]">
          <div className="w-[73%] py-4 mx-auto">
            <div className="mb-3">
              <div className="text-center flex gap-2 justify-between bg-background rounded-xl p-4 shadow-sm items-center">
                <div className="flex items-center gap-2">
                  <Link href="/items">
                    <Button className="p-2.5" variant="ghost">
                      <ArrowLeft className="text-stone-500" />
                    </Button>
                  </Link>
                  <p className="text-lg">
                    {getForm() && getForm().form_certificate}
                  </p>
                </div>
                <div className="flex flex-col items-end w-[300px]">
                  <Select 
                    onValueChange={(value) => onChangeFormSelect(value)}
                    value={selectedFormId || ''}
                  >
                    <SelectTrigger className="bg-stone-100 border-0 w-full rounded-xl">
                      <SelectValue placeholder="Select forms" className="bg-stone-100" />
                    </SelectTrigger>
                    <SelectContent draggable>
                      {forms && forms.map((form: any, key: number) => (
                        <SelectItem value={form.form_id} key={key} className="cursor-pointer">
                          {form.form_description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {Array.isArray(currentStepContentShowing()) && (
                currentStepContentShowing().length > 0
              ) ? (
                currentStepContentShowing().map((item: any, key: number) => {
                  if (!item.contents) {
                    return (
                      <Step1To7 
                        key={key}
                        title={item.title}
                        description={item.description}
                        images={item.images}
                        steps={key + 1}
                        listDescription={item.listDescription}
                        ref={item.stepRef}
                      />
                    );
                  } 
                  return (
                    <Step8To10Content 
                      key={key}
                      steps={key + 1}
                      title={item.title}
                      contents={item.contents}
                      ref={item.stepRef}
                    />
                  );
                })
              ) : (
                  <div className='p-5 rounded-xl shadow-sm bg-white text-center text-stone-500'>
                    A form has not yet been generated for {getForm() && getForm().form_description}.
                  </div>
                )}
              
              {protocolStepsContent(getForm() && getForm().form_type).length > indices.length && (
                <div className="flex justify-center">
                  <Button className="flex gap-5 py-3 text-lg px-10" onClick={onClickNextSteps}>
                    Next Steps <ChevronsDown />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <CSSTransition
            in={protocolStepsContent(getForm() && getForm().form_type).length === indices.length}
            nodeRef={stepnavRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
          >
            <StepsNav 
              ref={stepnavRef}
              onClickStep={onClickStep} 
              stepSelectedIndex={stepSelectedIndex} 
              form={getForm()}
              access_token={access_token}
            />
          </CSSTransition>
        </div>
      </div>
    </>
  );
});

Protocol.displayName = 'Protocol';

export default Protocol;