"use client";
import Image from "next/image";
import CarouselUI from "@components/CarouselUI";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Room } from "@prisma/client";
import LoadingImage from "@components/LoadingImage";

export default function Search() {
  const imageSize = 250;
  const lastPostRef = useRef(null);
  const [searchParam, setSearchParam] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [windowY, setWindowY] = useState(0);
  const [isSlide, setIsSlide] = useState(true);
  const pageLength = 12;

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  let { data, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [searchParam], // Note: allows for search filter functionality
    async ({ pageParam = 1 }) => {
      let query = "";
      if (searchParam) {
        query = `/api/images/query?limit=${pageLength}&page=${pageParam}&search=${searchParam}`;
      } else {
        query = `/api/images?limit=${pageLength}&page=${pageParam}`;
      }
      const { data } = await axios.get(query);
      return data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length) {
          return allPages.length + 1;
        } else {
          return false;
        }
      },
      initialPageParam: 1,
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, searchParam, selectedIndex, windowY]);

  const results = data?.pages.flatMap((page) => page) ?? [];

  let id = 0;

  const searchImages = (e) => {
    clearTimeout(id);
    id = setTimeout(() => {
      const userInput = e.target.value;

      if (userInput.length) {
        const regex = new RegExp(userInput, "i");
        for (let target of Object.keys(Room)) {
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

  function toggleZoom(e, index) {
    const carousel = document.querySelector("#searchCarousel");
    const searchBar = document.querySelector("#searchBar");
    const verticalScroll = document.querySelector("#verticalScroll");
    const arrowLeft = document.querySelector(".carousel-control-prev");
    const arrowRight = document.querySelector(".carousel-control-next");
    // Note: selectedIndex is one update stale due to useState update function
    let pageIndex = selectedIndex;

    // Check if left or right arrow clicked
    if (
      arrowRight &&
      (e.target == arrowRight.children[0] || e.target == arrowRight)
    ) {
      pageIndex = selectedIndex + 1;
      setSelectedIndex(pageIndex);
    } else if (
      arrowLeft &&
      (e.target == arrowLeft.children[0] || e.target == arrowLeft)
    ) {
      if (selectedIndex > 0) {
        pageIndex = selectedIndex - 1;
        setSelectedIndex(pageIndex);
      }
    }

    // Fetch next page if at end of page block
    if (pageIndex % pageLength == 0) {
      fetchNextPage();
    }

    // Hide carousel if carousel background clicked
    if (e.target.id == carousel.id) {
      carousel.classList.add("hidden");
      searchBar.classList.remove("hidden");
      verticalScroll.classList.remove("hidden");
      window.scrollTo({ top: windowY, left: 0, behavior: "instant" });

      // Show carousel
    } else if (carousel.classList.contains("hidden")) {
      carousel.classList.remove("hidden");
      searchBar.classList.add("hidden");
      verticalScroll.classList.add("hidden");
      // Snap to image, then quickly allow arrow transitions
      setIsSlide(false);
      setTimeout(() => setIsSlide(true), 100);
    }
  }

  return (
    <div className="max-w-7xl mx-auto mb-10 flex justify-center flex-col relative">
      {/* Carousel Package  */}
      <CarouselUI
        id={"searchCarousel"}
        windowY={windowY}
        data={results}
        selectedIndex={selectedIndex}
        toggleZoom={toggleZoom}
        isSlide={isSlide}
      />

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
              placeholder="Search by keyword (i.e. kitchen)"
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
        {results.map((elem, index) => (
          <div
            className="max-h-[15rem] min-h-[15rem]"
            key={elem.id}
            ref={index === results.length - 1 ? ref : null}
            onClick={(e) => {
              setWindowY(window.scrollY);
              toggleZoom(e, index);
            }}
          >
            <Image
              alt={"construction image"}
              priority={true}
              src={elem.url}
              height={imageSize}
              width={imageSize}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        ))}
      </div>
      {(isLoading || isFetchingNextPage) && <LoadingImage />}
    </div>
  );
}
