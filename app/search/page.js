"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const CATEGORIES = [
  "bathroom",
  "kitchen",
  "balcony",
  "livingroom",
  "exterior",
  "dining",
  "hallway",
  "floor",
];

export default function Search() {
  const imageSize = 250;
  const lastPostRef = useRef(null);
  const [searchParam, setSearchParam] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSlide, setIsSlide] = useState(true)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  let { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [searchParam], // Note: allows for search filter functionality
    async ({ pageParam = 1 }) => {
      let query = "";
      if (searchParam) {
        query = `/api/tags?limit=${12}&page=${pageParam}&search=${searchParam}`;
      } else {
        query = `/api/all-images?limit=${12}&page=${pageParam}`;
      }
      const { data } = await axios.get(query);
      return data;
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: { pages: [], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, searchParam, selectedIndex]);

  const results = data?.pages.flatMap((page) => page) ?? [];
  let id = 0;

  const searchImages = (e) => {
    clearTimeout(id);
    id = setTimeout(() => {
      const userInput = e.target.value;

      if (userInput.length) {
        const regex = new RegExp(userInput, "i");
        for (let target of CATEGORIES) {
          if (regex.test(target)) {
            setSearchParam(target);
            break;
          }
        }
      } else {
        setSearchParam("");
      }
    }, 500);
  };

  const toggleZoom = (e, val) => {
    const carousel = document.querySelector("#carousel");
    const searchBar = document.querySelector("#searchBar");
    const verticalScroll = document.querySelector("#verticalScroll");
    const arrowLeft = document.querySelector(".carousel-control-prev");
    const arrowRight = document.querySelector(".carousel-control-next");

    // Check if left or right arrow clicked 
    if (arrowRight && (e.target == arrowRight.children[0] || e.target == arrowRight)) {
      setSelectedIndex(prev => prev + 1);
    } else if (arrowLeft && (e.target == arrowLeft.children[0] || e.target == arrowLeft)) {
      if (selectedIndex > 0) {
        setSelectedIndex(prev => prev - 1);
      }
    }
    // Hide carousel if carousel background clicked
    if (e.target.id == carousel.id) {
      carousel.classList.add("hidden");
      searchBar.classList.remove("hidden");
      verticalScroll.classList.remove("hidden");
      // Show carousel
    } else if (carousel.classList.contains("hidden")) {
      carousel.classList.remove("hidden");
      searchBar.classList.add("hidden");
      verticalScroll.classList.add("hidden");
      // Set carousel to selected image
      setSelectedIndex(val);
      // Snap to image, then quickly allow arrow transitions
      setIsSlide(false)
      setTimeout(() => setIsSlide(true), 100)
    }
  };


  return (
    <div className="max-w-7xl mx-auto mb-10 flex justify-center flex-col relative">
      {/* Carousel Package  */}
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
          onSelect={(idx) => idx === results.length - 1 ? fetchNextPage() : null
          }
          className="sm:max-w-[80%] mx-auto absolute top-[50%] -translate-y-[50%]"
        >
          {results.map((elem, index) => {
            if (elem !== null && elem !== undefined) {
              if (index === results.length - 1) {
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
                          className="min-h-[25rem] max-h-[25rem] md:min-h-[30rem] md:max-h-[30rem] xl:min-h-[50rem] xl:max-h-[50rem] my-auto w-full rounded-md"
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
                        className="min-h-[25rem] max-h-[25rem] md:min-h-[30rem] md:max-h-[30rem] xl:min-h-[50rem] xl:max-h-[50rem] my-auto w-full rounded-md"
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </Carousel.Item>
              );
            }
          })}
        </Carousel>
      </div>

      {/* Search Bar */}
      <div
        className="flex flex-1 items-center justify-center px-10 md:px-0 my-10 flex"
        id="searchBar"
      >
        <div className="w-full max-w-lg lg:max-w-lg">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1b263b] sm:text-sm sm:leading-6"
              placeholder="Search by keyword (i.e. living room, bedroom, etc.)"
              type="search"
              onChange={searchImages}
            />
          </div>
        </div>
      </div>

      <div
        className="mx-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4"
        id="verticalScroll"
      >
        {results.map((elem, index) => {
          if (elem !== null && elem !== undefined) {
            if (index === results.length - 1) {
              return (
                <div
                  className=""
                  key={elem.id}
                  ref={ref}
                  onClick={(e) => toggleZoom(e, index)}
                >
                  <Image
                    alt={"construction image"}
                    src={elem.url}
                    height={imageSize}
                    width={imageSize}
                    className="max-h-[15rem] min-h-[15rem] w-full rounded-md"
                  />
                </div>
              );
            }

            return (
              <div
                className=""
                key={elem.id}
                onClick={(e) => toggleZoom(e, index)}
              >
                <Image
                  alt={"construction image"}
                  priority={true}
                  src={elem.url}
                  height={imageSize}
                  width={imageSize}
                  className="max-h-[15rem] min-h-[15rem] w-full rounded-md"
                />
              </div>
            );
          }
        })}
      </div>
      {isFetchingNextPage && (
        <div role="status" className="self-center mt-5">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
