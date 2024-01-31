import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function LoadImage( imageProps : ImageProps) {
  const [loading, setLoading] = useState(true);
  return (
    <Image 
      {...imageProps}
      width={imageProps.width} 
      height={imageProps.height} 
      alt={imageProps.alt} 
      src={imageProps.src} 
      className={cn(
        imageProps.className,
        loading ? 'blur-md' : 'blur-none',
      )} 
      onLoadingComplete={() => setLoading(false)}
    />
  );
};