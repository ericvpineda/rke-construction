"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

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
  }, [entry, fetchNextPage, searchParam]);

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
      }
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto mb-10 flex justify-center flex-col">
      {/* Search Bar */}
      <div className="flex flex-1 items-center justify-center px-10 md:px-0 my-10 flex">
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

      <div className="mx-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((elem, index) => {
          if (elem !== null && elem !== undefined) {
            if (index === results.length - 1) {
              return (
                <div className="" key={elem.id} ref={ref}>
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
              <div className="" key={elem.id}>
                <Image
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
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          <span class="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
