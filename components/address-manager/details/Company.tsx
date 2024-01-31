import {
  CmsDetailsContext,
  ContainerSizeContext,
} from "@/pages/address-manager/[cms_id]";
import { ArrowLeft, Globe, Mail, Phone, Printer } from "lucide-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import TemporaryLogo, { cmsLogoColor } from "../temporary-logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";

const Company = () => {
  const cms: any = useContext(CmsDetailsContext);
  const containerRef = useRef<any>(null);
  const containerSize: any = useContext(ContainerSizeContext);

  useEffect(() => {
    if (containerRef.current) {
      const theme = themeFromSourceColor(
        argbFromHex(cmsLogoColor(cms?.cms_logo_colors).text),
        [
          {
            name: "custom-1",
            value: argbFromHex(cmsLogoColor(cms?.cms_logo_colors).text),
            blend: true,
          },
        ]
      );
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(theme, { target: containerRef.current, dark: systemDark });
    }
  }, [containerRef, cms]);

  return (
    <div
      ref={containerRef}
      className="bg-white shadow-md min-h-[calc(100vh-var(--header-height)-40px)] rounded-app flex flex-col p-3"
      style={{ boxShadow: containerSize?.width < 1000 ? "none" : undefined }}
    >
      <div className="h-[350px] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center rounded-xl">
        <TemporaryLogo cms={cms} />
      </div>

      <p className="text-xl font-bold m-4 text-[var(--md-sys-color-on-primary-container)]">
        {cms?.cms_name}
      </p>

      <div className="flex flex-col gap-2 px-4 text-[var(--md-sys-color-on-secondary-container)]">
        {cms?.cms_email && (
          <div className="flex gap-2 hover:bg-[var(--md-sys-color-on-primary)] p-3 rounded-app">
            <Mail className="opacity-60 w-[18px] text-[var(--md-sys-color-secondary)]" />{" "}
            <span className="w-[calc(100%-20px)]">{cms.cms_email}</span>
          </div>
        )}

        {cms?.cms_phone_number && (
          <div className="flex gap-2 hover:bg-[var(--md-sys-color-on-primary)] p-3 rounded-app">
            <Phone className="opacity-60 w-[18px] text-[var(--md-sys-color-secondary)]" />{" "}
            <span className="w-[calc(100%-20px)]">{cms.cms_phone_number}</span>
          </div>
        )}

        {cms?.cms_fax && (
          <div className="flex gap-2 hover:bg-[var(--md-sys-color-on-primary)] p-3 rounded-app">
            <Printer className="opacity-60 w-[18px] text-[var(--md-sys-color-secondary)]" />{" "}
            <span className="w-[calc(100%-20px)]">{cms.cms_fax}</span>
          </div>
        )}

        {cms?.cms_website && (
          <div className="flex gap-2 hover:bg-[var(--md-sys-color-on-primary)] p-3 rounded-app">
            <Globe className="opacity-60 w-[18px] text-[var(--md-sys-color-secondary)]" />{" "}
            <span className="w-[calc(100%-20px)]">{cms.cms_website}</span>
          </div>
        )}
      </div>

      <div className="mt-auto flex gap-4">
        <div className="w-1/2 p-3 flex flex-col gap-2 rounded-xl bg-[var(--md-sys-color-inverse-primary)] text-[var(--md-sys-color-on-primary-container)]">
          <span>Employees</span>
          <span className="text-2xl font-bold">{cms?.total_employees}</span>
        </div>

        <div className="w-1/2 p-3 flex flex-col gap-2 rounded-xl bg-[var(--md-sys-color-inverse-primary)] text-[var(--md-sys-color-on-primary-container)]">
          <span>Locaitons</span>
          <span className="text-2xl font-bold">{cms?.total_locations}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Company);

export const ContainerDialog = ({
  onOpenChange,
  open,
  children,
  showSheet,
}: {
  onOpenChange?: (open?: boolean) => void;
  open?: boolean;
  children?: React.ReactNode;
  showSheet?: boolean;
}) => {
  const [scrollHeaderHeight, setScrollHeaderHeight] = useState<any>(0);

  if (!showSheet) return children;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[400px] bg-white p-0 border-0">
        <div
          className="py-3 px-4 items-center flex justify-between border-b border-b-stone-200/70"
          ref={(el) => setScrollHeaderHeight(el?.offsetHeight)}
        >
          <div className="flex items-center gap-2">
            <button
              className="w-fit p-1 rounded-full bg-stone-100 hover:bg-stone-200"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              <ArrowLeft />
            </button>
            {/* <span className="text-base font-medium">Reported Items</span> title */}
          </div>
        </div>

        <ScrollArea
          viewPortStyle={{ height: `calc(100vh - ${scrollHeaderHeight}px)` }}
          viewPortClassName="flex flex-col"
        >
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
