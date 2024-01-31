import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AccessTokenContext } from "@/context/access-token-context";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export const previewType = [
  'Packing List',
  'Proforma Invoice',
  'Commercial Invoice',
  'Shipped Back',
];

export const displayTypes = [
  {'Detailed List': 'true'},
  {'Simplified List (Without Items on Set)': 'false'},
];

export const attributes = [
  {serial: 'Serial'},
  {picture: 'Picture'},
  {origin: 'Origin'},
  {value: 'Value'},
  {weight: 'Weight'},
  {code: 'HSCode'},
];

const ShippingPreview = (props: ShippingPreviewProps) => {
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const pdfRef = useRef<HTMLDivElement>(null);
  const pdfRefCurrent = pdfRef.current;
  const shipping_id = shippingDetails ? shippingDetails._shipping_id : null;
  const access_token = useContext(AccessTokenContext);
  const [type, setType] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [blobUrl, setBlobUrl] = useState<any>(null);
  const [blobTitle, setBlobTitle] = useState<any>(null);

  const queryDisplayed: any = router.query.detailed;
  const queryType = type || router.query.type;
  const routerQuery: any = router.query;
  
  const pageRoute: any = useMemo(() => {
    return {
      pathname: router.pathname,
      query: {
        shipping_id: router.query.shipping_id,
        ...routerQuery
      },
    }
  }, [routerQuery, router]);

  const onDownload = () => {
    const a = document.createElement('a');
    a.href = blobUrl;
    if (blobTitle) a.download = blobTitle + '.pdf';
    a.click();
    return;
  };

  const onViewPdf = useCallback(async () => {
    if (shipping_id) {
      const queryParams = new URLSearchParams(routerQuery);
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/projects/shipping/preview/${shipping_id}?${queryParams.toString()}`, {
          headers: {...authHeaders(access_token)}
        });
        const blob = await res.blob();
        const objectURL = URL.createObjectURL(blob);
        setLoading(false);

        let filename = res.headers.get('Title');
        setBlobTitle(filename);
        setBlobUrl(objectURL);
  
        const iframe = document.createElement('iframe');
        iframe.src = objectURL;
        iframe.setAttribute('frameborder', '0');
        iframe.className = "w-full h-full";
        if (pdfRefCurrent) pdfRefCurrent.innerHTML = iframe.outerHTML;

        setLoading(false);
      }
      catch(err) {
        setLoading(false);
        console.log(err);
      }
    }
  }, [
    pdfRefCurrent, 
    shipping_id, 
    access_token,
    routerQuery,
  ]);

  useEffect(() => {
    onViewPdf();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'scroll';
    }
  }, [onViewPdf]);

  useEffect(() => {
    if (!router.query.detailed && !router.query.type) {
      const [value] = Object.values(displayTypes[0]);
      router.push({
        ...pageRoute,
        query: {
          ...pageRoute.query,
          detailed: value,
          type: previewType[0]
        }
      });
    }
  }, [router, pageRoute]);

  return (
    <div className="flex h-[100vh]">
      <div className="w-[400px] bg-background">
        <div className="p-2 flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2">
            <Link href={`/projects/shipping-list/${shipping_id}`}>
              <Button 
                className={cn("p-2.5")} 
                variant="ghost"
              >
                <ArrowLeft className="text-stone-500" />
              </Button>
            </Link>
            <p className="text-base font-medium">Preview Shipping Details</p>
          </div>

          <div className="px-3 py-4">
            <p className="mb-4 opacity-75">Preview Type</p>
            <RadioGroup 
              onValueChange={(value: any) => {
                setType(value);
                router.push({
                  ...pageRoute,
                  query: {
                    ...pageRoute.query,
                    type: value,
                  }
                });
              }}
            >
              {previewType.map((type: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem className="data-[state=checked] border-primary/20 cursor-pointer" 
                    value={type} 
                    id={type + index} 
                    checked={queryType == type}
                  />
                  <label className="cursor-pointer" htmlFor={type + index}>{type}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="px-3 py-4">
            <p className="mb-4 opacity-75">Display Type</p>
            <RadioGroup 
              defaultValue={queryDisplayed}
              onValueChange={(value: any) => {
                router.push({
                  ...pageRoute,
                  query: {
                    ...pageRoute.query,
                    detailed: value,
                  }
                });
              }}
            >
              {displayTypes.map((obj: any, key: number) => {
                const [label] = Object.keys(obj);
                const [value]: any = Object.values(obj);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <RadioGroupItem className="data-[state=checked] border-primary/20 cursor-pointer" 
                      value={value} 
                      id={'id' + key}
                      checked={queryDisplayed === value}
                    />
                    <label className="cursor-pointer" htmlFor={'id' + key}>{label}</label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="px-3 py-4">
            <p className="mb-4 opacity-75">Attributes</p>
            <div className="flex flex-col gap-2">
              {attributes.map((attribute: any, index: number) => {
                const [key] = Object.keys(attribute);
                const [label]: any = Object.values(attribute);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox className="data-[state=checked] border-primary/20 cursor-pointer rounded-none" 
                      onCheckedChange={checked => {
                        router.push({
                          ...pageRoute,
                          query: {
                            ...pageRoute.query,
                            [key]: String(checked),
                          }
                        });
                      }} 
                      id={'attr-id' + index} 
                      checked={router.query[key] === 'true' ? true : false}
                    />
                    <label 
                      className="cursor-pointer" 
                      htmlFor={'attr-id' + index}
                    >
                      {label}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
          
          <Button 
            className={cn(
              "mt-auto",
              isDownload && loading && 'loading'
            )} 
            onClick={onDownload}
          >
            Download
          </Button>
        </div>
      </div>
      <div ref={pdfRef} className="w-[calc(100%-400px)] h-full relative" />
    </div>
  );
};

export default memo(ShippingPreview);

type ShippingPreviewProps = {
  
}