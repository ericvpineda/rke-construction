"use client";
import axios from "axios";
import Image from "next/image";
import PopUp from "@components/PopUp";
import { Room } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [images, setimages] = useState([]);
  const [isAddImage, setisAddImage] = useState(false);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/images");
      setimages(data);
    } catch (error) {
      // TODO: Add failure response ui
      console.log("Error: Failure to fetch images.");
      console.log(error);
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const images = e.target.files.files;
    const index = e.target.selected.selectedIndex;
    const category = e.target.selected[index].text;

    if (index === 0) {
      // TODO: Create error toast notification
      console.log("Error: Please select cateogry.");
    } else {
      const formData = new FormData();
      for (let image of images) {
        formData.append("images", image);
        formData.append("imageNames", image.name);
      }
      formData.append("category", category.toLowerCase());
      const { data } = await axios.post("/api/images/tags", formData, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      setisAddImage(false)
      setimages(prev => [...prev, ...data])
    }
  };

  const togglePopup = () => {
    setisAddImage(!isAddImage);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 mt-4">
      {isAddImage && (
        <PopUp togglePopup={togglePopup}>
          <h1 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
            Add Image(s)
          </h1>
          <form encType="multipart/form-data" onSubmit={formSubmitHandler} className="flex flex-col justify-center ">
            <input
              id="files"
              type="file"
              name="files[]"
              multiple
              accept=".pdf, .jpg, .jpeg, .png"
              required
              className="mb-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />

            <select
              id="categories"
              class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              name="selected"
              required
            >
              <option selected disabled className="lowercase">
                Choose a category
              </option>
              {Object.keys(Room).map((room) => (
                <option value={room} className="p-2">
                  {room.toLowerCase()}
                </option>
              ))}
            </select>
            <button className="button_custom">Submit</button>
          </form>
        </PopUp>
      )}

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
            onClick={() => togglePopup()}
            className="button_custom"
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
                className="grid lg:grid-cols-5 grid-cols-3 items-center justify-center"
              >
                <div className="whitespace-nowrap py-4  text-sm font-medium text-gray-900 sm:pl-0 text-center flex justify-center">
                  <Image
                    src={image.url}
                    alt="project"
                    height={200}
                    width={200}
                    className="object-cover ml-5 sm:ml-0 xl:ml-10 rounded-md shadow-sm min-h-[7rem] max-h-[7rem] md:min-h-[10rem] md:max-h-[10rem] xl:min-h-[14rem] xl:max-h-[14rem] min-w-[7rem] max-w-[7rem] md:min-w-[10rem] md:max-w-[10rem] xl:min-w-[14rem] xl:max-w-[14rem]"
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
