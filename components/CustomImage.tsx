import NextImage, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export default function CustomImage(props: ImageProps) {
  const [hasImage, setHasImage] = useState(false);
  const errorImage = '/images/404.svg';

  useEffect(() => {
    (async () => {
      try {
        const imageExists = await checkImage(props.src);
        setHasImage(imageExists);
      } 
      catch(err) {
        setHasImage(false);
      }
    })();
  }, [props]);

  return <NextImage 
    {...props}
    src={hasImage ? props.src : errorImage}
    // placeholder="blur"
  />;
}

function checkImage(imgSrc: string | any) {
  return new Promise<boolean>((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.width = 10;
    img.height = 10;

    img.onload = () => {
      resolve(true);
    }

    img.onerror = () => {
      reject(false);
    }
  });
}