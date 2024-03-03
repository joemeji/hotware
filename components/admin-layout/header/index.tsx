import Avatar from "./avatar";
import HeaderIcons from "./header-icons";
import TopSidebar from "../sidebar/top-sidebar";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/search-bar";
import { useContext, useEffect, useRef } from "react";
import { BreakPointContext } from "@/context/layout-context";
type HeaderProp = {
  onToggleSidebar?: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProp) {
  const bp = useContext(BreakPointContext);
  const headerRef = useRef<any>(null);

  let prevScrollpos = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  useEffect(() => {
    const windowScroll = () => {
      if (typeof window !== "undefined") {
        let currentScrollPos = window.scrollY;

        if (prevScrollpos.current <= currentScrollPos) {
          headerRef.current?.classList.remove("fixedToTop");
          if (headerRef.current)
            headerRef.current.style.top = `calc(0px - ${currentScrollPos}px)`;
        } else {
          headerRef?.current.classList.add("fixedToTop");
          if (headerRef?.current) headerRef.current.style.top = "0";
        }

        prevScrollpos.current = currentScrollPos;
      }
    };

    window.addEventListener("scroll", windowScroll);

    return () => {
      window.removeEventListener("scroll", windowScroll);
    };
  }, [headerRef, prevScrollpos]);

  return (
    <header
      className={cn(
        "flex fixed top-0 right-0 h-[var(--header-height)] w-full bg-white shadow-sm z-10",
        "d-flex"
      )}
      ref={headerRef}
    >
      <div className="w-[33.33%]">
        <TopSidebar inHeader={true} onToggleSidebar={onToggleSidebar} />
      </div>
      <div
        className="w-[33.33%] flex h-full items-center justify-center"
        style={{
          width: bp === "md" ? "370px" : "33.33%",
          marginLeft: bp === "md" ? "auto" : "inherit",
          marginRight: bp === "md" ? "10px" : "inherit",
        }}
      >
        <div className={cn("w-full", (bp === "sm" || bp === "xs") && "hidden")}>
          <SearchBar />
        </div>
      </div>
      <div
        className="flex items-center gap-1 md:gap-3 w-[33.33%] pe-4 justify-end"
        style={{
          width: bp === "md" ? "auto" : "33.33%",
        }}
      >
        {/* <HeaderIcons /> */}
        <Avatar />
      </div>
    </header>
  );
}
