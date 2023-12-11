"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageForm from "@components/ImageForm";
import ImageEdit from "@components/ImageEdit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import LoadingImage from "@components/LoadingImage";
import toast from "react-hot-toast";

export default function Admin() {
  const [isAddImage, setisAddImage] = useState(false);
  const [addedImages, setaddedImages] = useState([]);
  const lastPostRef = useRef(null);
  const pageLength = 12;

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  let { data, fetchNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteQuery(
      [],
      async ({ pageParam = 1 }) => {
        const { data } = await axios.get(
          `/api/images?limit=${pageLength}&page=${pageParam}`
        );
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

  const results = data?.pages.flatMap((page) => page) ?? [];


  const formAddImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const images = e.target.files.files;
      const index = e.target.selected.selectedIndex;
      const category = e.target.selected[index].text;

      if (index === 0) {
        toast.error("Please select a category.")
      } else {
        const toastId = toast.loading('Uploading image...');
        const formData = new FormData();
        for (let image of images) {
          formData.append("images", image);
          formData.append("imageNames", image.name);
        }
        formData.append("category", category);
        const { data } = await axios.post("/api/images", formData, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        toast.dismiss(toastId)
        setisAddImage(false);
        setaddedImages((prev) => [...prev, ...data]);
        toast.success("Success image(s) added.")
      }
    } catch (error) {
      toast.dismiss()
      toast.error("Failure to add image. Please try again.")
    }
  };

  const toggleIsAddImage = () => {
    setisAddImage(!isAddImage);
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      !isFetching && fetchNextPage();
    }
  }, [entry]);

  return (
    <div className="container-style px-4 sm:px-6 lg:px-8">
      {isAddImage && (
        <ImageForm
          togglePopupHandler={toggleIsAddImage}
          formSubmitHandler={formAddImageSubmit}
          action="Add"
        />
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
            onClick={() => toggleIsAddImage()}
            className="button_custom"
          >
            Add images
          </button>
        </div>
      </div>
      {/* Table  */}
      <div className="-mx-4 mt-8 sm:-mx-0 shadow-sm rounded-md">
        <div className="min-w-full divide-y divide-gray-300">
          <div className="grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-3 text-md">
            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 sm:pl-0 text-center"
            >
              Image
            </div>
            <div
              scope="col"
              className="py-3.5 pl-7 sm:pl-0 font-semibold text-gray-900 text-center"
            >
              Category
            </div>

            <div
              scope="col"
              className="py-3.5 font-semibold text-gray-900 text-center hidden sm:block"
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
            {addedImages.map((image) => (
              <ImageEdit storedImage={image} />
            ))}
            {results.map((image, index) => (
              <ImageEdit
                storedImage={image}
                ref={index === results.length - 1 ? ref : null}
              />
            ))}
          </div>
        </div>
      </div>
      {(isLoading || isFetchingNextPage) && <LoadingImage />}
    </div>
  );
}
