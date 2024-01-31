import { useEffect, useState } from "react";

type ElementSizeType = {
  height?: number | undefined
  width?: number | undefined
}

export default function useElementSize(elSelector: string | undefined) {
  const [elementSize, setElementSize] = useState<ElementSizeType>();

  useEffect(() => {
    function elementSizeChange() {
      const elem: HTMLDivElement | null = document.querySelector(`${elSelector}`);
      if (elem) {
        const { top, left, width, height } = elem.getBoundingClientRect();
        setElementSize({
          width: width - left,
          height: height - top,
        });
      }
    }

    elementSizeChange();

    window.addEventListener('resize', (e) => {
      elementSizeChange();
    });

    return () => {
      window.removeEventListener('resize', (e) => {
        elementSizeChange();
      });
    }

  }, []);

  return elementSize;
}