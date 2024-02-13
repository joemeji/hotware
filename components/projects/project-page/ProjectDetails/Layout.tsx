import { Button } from "@/components/ui/button";
import { AccessTokenContext } from "@/context/access-token-context";
import useSize from "@/hooks/useSize";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { fetchApi } from "@/utils/api.config";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

type Layout = {
  render?: (headerSize?: any) => React.ReactNode;
};

const links = [
  {
    href: "overview",
    label: "Overview",
  },
  {
    href: "address_supplier",
    label: "Address/Supplier",
  },
  {
    href: "scope_of_work",
    label: "Scope of Work",
  },
  {
    href: "client",
    label: "Client",
  },
  {
    href: "equipments",
    label: "Equipments",
  },
  {
    href: "technicians",
    label: "Technicians",
  },
  {
    href: "tasks",
    label: "Tasks",
  },
  {
    href: "documents",
    label: "Documents",
  },
];

const TabLink = ({ href, label }: { href?: any; label?: string }) => {
  const router = useRouter();

  const path = `${router.query.project_id}/${href}`;

  const active = useMemo(() => {
    if (router.asPath) {
      return router.asPath.includes(path);
    }
    return false;
  }, [router.asPath, path]);

  return (
    <Link
      href={`/projects/${path}`}
      className={cn(
        "px-3 py-2 font-medium hover:bg-white/70 rounded-app",
        active && "bg-white/80 pointer-events-none text-back"
        // active &&
        // "pointer-events-none text-red-600 relative after:content-[''] after:absolute after:-bottom-2 after:h-1 after:w-full after:bg-red-600 after:left-0 after:rounded-[3px]"
      )}
    >
      {label}
    </Link>
  );
};

export const LayoutContext = createContext(null);

const Layout = ({ render }: Layout) => {
  const headerRef = useRef(null);
  const headerSize = useSize(headerRef);
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();

  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading } = useSWR(
    [`/api/projects/${router.query.project_id}?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <ProjectDetailsContext.Provider value={{ data, isLoading }}>
      <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto">
        <div
          ref={headerRef}
          className="bg-[url(/images/wave-bg.jpg)] rounded-xl relative z-0 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-stone-100/30 after:z-[-1]"
        >
          <div className="py-3 px-3 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold text-white">Atlantic Hardware</p>
              <p className="opacity-90 text-white">P.023.1009.0</p>
            </div>
            <Button>Edit Project</Button>
          </div>
          <div className="flex items-start mt-[1px] px-3 py-2 gap-1">
            {links.map((item: any, key: number) => (
              <TabLink key={key} href={item.href} label={item.label} />
            ))}
          </div>
        </div>
        {render && render(headerSize)}
      </div>
    </ProjectDetailsContext.Provider>
  );
};

export default Layout;
