import { memo } from "react";

export const cmsLogoColor = (cms_logo_colors: any) => {
  if (cms_logo_colors) {
    return JSON.parse(cms_logo_colors);
  }
  return {
    bg: "#f87171",
    text: "#b91c1c",
  };
};

const TemporaryLogo = ({ cms, size }: { cms: any; size?: any }) => {
  const cmsName = () => {
    let name = "N";
    if (typeof cms?.cms_name === "string") {
      name = cms?.cms_name;
      name = name.replaceAll(" ", "");
      name = name.replace(/['"]+/g, "");
    }
    return name;
  };

  return (
    <div
      className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
      style={{
        background: cmsLogoColor(cms?.cms_logo_colors).bg,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <span
        className="text-[50px] font-bold leading-[0]"
        style={{
          color: cmsLogoColor(cms?.cms_logo_colors).text,
          fontSize: `${size / 2}px`,
        }}
      >
        {cmsName().replaceAll(" ", "")[0] || 0}
      </span>
    </div>
  );
};

export default memo(TemporaryLogo);
