import LoadImage from "@/components/load-image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Circle } from "lucide-react";
import React from "react";

const Step8To10Content = React.forwardRef((props: any, ref: any) => {
  const { contents, title, steps } = props;

  return (
    <div className="bg-white overflow-hidden flex flex-col relative gap-1 shadow-sm rounded-xl" ref={ref}>
      <span className="border-2 border-green-400 text-green-700 rounded-full py-1.5 px-3 font-medium justify-center flex w-fit absolute top-3 left-3">
        Step {steps}
      </span>
      {contents && contents.map((content: any, key: number) => (
        <div className="flex" key={key}>
          <div className="w-1/2 pe-5 relative flex items-center">
            <div className="flex flex-col gap-3 px-8">
              {key === 0 && <h1 className="text-3xl font-bold">{title}</h1>}
              {content.description && <p className="text-lg">{content.description}</p>}
              {content.listDescription && (
                <ul className="flex flex-col gap-2 my-2">
                  {content.listDescription.map((list: string, key: number) => (
                    <li key={key} className="text-lg flex items-start gap-3">
                      <Circle className="fill-red-400 stroke-red-400 mt-2" width={11} height={11} /> 
                      <span className="w-[calc(100%-11px)]">{list}</span>
                    </li>
                  ))}
                </ul>
              )}
              {content.additionalDescription && <p className="text-lg">{content.additionalDescription}</p>}
            </div>
          </div>
          <div className="w-1/2">
            <Splide aria-label="My Favorite Images">
              {content.images.map((src: string, key: number) => (
                <SplideSlide className="_splide-li bg-stone-950" key={key}>
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
      ))}
    </div>
  );
});

Step8To10Content.displayName = 'Step8To10Content';

export default Step8To10Content;