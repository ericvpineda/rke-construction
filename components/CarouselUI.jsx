import Carousel from "react-bootstrap/Carousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";

export default function CarouselUI({data, selectedIndex, toggleZoom, isSlide}) {
 
  return (
    <div
      className="top-0 left-0 right-0 bottom-0 bg-black h-screen fixed my-auto hidden"
      id="carousel"
      onClick={toggleZoom}
    >
      <Carousel
        activeIndex={selectedIndex}
        wrap={false}
        interval={null}
        indicators={false}
        slide={isSlide}
        onSelect={(idx) =>
          idx === data.length - 1 ? fetchNextPage() : null
        }
        className="mx-auto absolute top-[50%] -translate-y-[50%] sm:left-[50%] sm:-translate-x-[50%]"
      >
        {data.map((elem, index) => {
          if (elem !== null && elem !== undefined) {
            if (index === data.length - 1) {
              return (
                <Carousel.Item className="" key={elem.id}>
                  <TransformWrapper
                    styles="width:100% !important;"
                    key={elem.id}
                    disablePadding={true}
                  >
                    <TransformComponent styles="width:100% !important;">
                      <Image
                        alt={"construction image"}
                        src={elem.url}
                        height={1000}
                        width={1000}
                        className="min-h-[25rem] max-h-[25rem] md:min-h-[40rem] md:max-h-[40rem] xl:min-h-[50rem] xl:max-h-[50rem] my-auto w-full rounded-md"
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </Carousel.Item>
              );
            }

            return (
              <Carousel.Item key={elem.id}>
                <TransformWrapper
                  styles="width:100% !important;"
                  key={elem.id}
                  disablePadding={true}
                >
                  <TransformComponent styles="width:100% !important;">
                    <Image
                      alt={"construction image"}
                      priority={true}
                      src={elem.url}
                      height={1000}
                      width={1000}
                      className="min-h-[25rem] max-h-[25rem] md:min-h-[40rem] md:max-h-[40rem] xl:min-h-[50rem] xl:max-h-[50rem] my-auto w-full rounded-md"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </Carousel.Item>
            );
          }
        })}
      </Carousel>
    </div>
  );
}