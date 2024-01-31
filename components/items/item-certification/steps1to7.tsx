import LoadImage from "@/components/load-image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Circle } from "lucide-react";
import Image from "next/image";
import React from "react";

const Step1To7 = React.forwardRef((props: any, ref: any) => {
  const { title, description, images, steps, listDescription } = props;

  return (
    <div className="bg-white flex shadow-sm rounded-xl overflow-hidden" ref={ref}>
      <div className="w-1/2 pe-5 relative flex items-center">
        <span className="border-2 border-green-400 text-green-700 rounded-full py-1.5 px-3 font-medium justify-center flex w-fit absolute top-3 left-3">
          Step {steps}
        </span>

        <div className="flex flex-col gap-3 px-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-lg ">{description}</p>}
          {listDescription && (
            <ul className="flex flex-col gap-2 mt-2">
              {listDescription.map((list: string, key: number) => (
                <li key={key} className="text-lg flex items-center gap-3">
                  <Circle className="fill-red-400 stroke-red-400" width={11} height={11} /> {list}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-1/2">
        <Splide aria-label="My Favorite Images">
          {images.map((src: string, key: number) => (
            <SplideSlide className="_splide-li" key={key}>
              <div className="relative overflow-hidden p-7">
                <div className="absolute inset-0 z-0 blur-2xl" style={{ backgroundImage: `url(${src})` }} />
                <LoadImage 
                  width={400} 
                  height={400} 
                  alt={title || 'No Title'}
                  src={src} 
                  className="h-[500px] w-full object-contain"
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
});

Step1To7.displayName = 'Step1To7';

export default Step1To7;