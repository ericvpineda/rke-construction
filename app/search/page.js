"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Search() {
  const lastPostRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/images?limit=${12}&page=${pageParam}`;
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
      console.log("DEBUG: fetching next page...")
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const results = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="max-w-7xl mx-auto mb-10">
      {/* Search Bar */}
      <div className="flex flex-1 items-center justify-center px-10 md:px-0 my-10">
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
            />
          </div>
        </div>
      </div>

      {/* Images Search  */}
      <div className="mx-20 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((elem, index) => {
          if (elem !== null && elem !== undefined) {
            if (index >= results.length - 4) {
              return (
                <div className="" key={elem.id} ref={ref}>
                  <Image
                    src={elem.url}
                    height={500}
                    width={500}
                    className="max-h-[15rem] min-h-[15rem] w-full rounded-md"
                  />
                </div>
              );
            }

            return (
              <div className="" key={elem.id}>
                <Image
                  src={elem.url}
                  height={500}
                  width={500}
                  className="max-h-[15rem] min-h-[15rem] w-full rounded-md"
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
