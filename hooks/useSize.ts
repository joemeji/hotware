import useResizeObserver from "@react-hook/resize-observer";
import React from "react";

const useSize = (target: any) => {
  const [size, setSize] = React.useState();

  if (typeof window !== "undefined") {
    React.useLayoutEffect(() => {
      setSize(target?.current?.getBoundingClientRect());
    }, [target]);

    // Where the magic happens
    useResizeObserver(target, (entry: any) => setSize(entry.contentRect));
  }

  return size;
};

export default useSize;
