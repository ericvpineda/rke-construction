"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Admin() {
  const [images, setimages] = useState([]);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/all-images");
      setimages(data);
    } catch (error) {
      // TODO: Add failure response ui
      console.log("Error: Failure to fetch images.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 mt-4">
      {/* Heading  */}
      <div className="sm:flex sm:items-center bg-[#343a40] text-white p-4 rounded-md">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
            Administrator
          </h1>
          <p className="mt-2 text-sm text-white">
            Upload or edit images that will be posted on the Search page.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-[#023e8a] !px-3 !py-2 text-center !text-sm !font-semibold text-white shadow-sm hover:bg-[#1b263b] focus-visible:outline-[#1b263b]"
          >
            Add image
          </button>
        </div>
      </div>
      {/* Table  */}
      <div className="-mx-4 mt-8 sm:-mx-0 shadow-sm rounded-md">
        <div className="min-w-full divide-y divide-gray-300">
          <div className="grid lg:grid-cols-5 grid-cols-3 text-md">
            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 sm:pl-0 text-center"
            >
              Image
            </div>
            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 text-center"
            >
              Category
            </div>

            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 text-center hidden lg:block"
            >
              Created At
            </div>
            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 text-center hidden lg:block"
            >
              Uploaded At
            </div>
            <div className="py-3.5"></div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {images.map((image) => (
              <div
                key={image.id}
                className="grid lg:grid-cols-5 grid-cols-3 items-center"
              >
                <div className="whitespace-nowrap py-4  text-sm font-medium text-gray-900 sm:pl-0 text-center flex justify-center">
                  <Image
                    src={image.url}
                    alt="project"
                    height={200}
                    width={200}
                    className="rounded-md shadow-sm"
                  />
                </div>
                <div className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                  {image.category}
                </div>

                <div className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center hidden lg:block">
                  {image.dateTaken}
                </div>
                <div className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center hidden lg:block">
                  {image.createdAt}
                </div>
                <div className="whitespace-nowrap py-4 pl-3 !pr-20 text-right text- font-medium sm:pr-0">
                  <a
                    href="#"
                    className="font-bold uppercase text-[#023e8a] hover:text-[#1b263b] underline decoration-[#023e8a] hover:decoration-[#1b263b]  decoration-1 decoration-solid"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
