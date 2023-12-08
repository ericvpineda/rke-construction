"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ImageForm from "@components/ImageForm";
import ImageEdit from "@components/ImageEdit";

export default function Admin() {
  const [allImages, setAllImages] = useState([]);
  const [isAddImage, setisAddImage] = useState(false);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/images");
      setAllImages(data);
    } catch (error) {
      // TODO: Add failure response ui
      console.log("Error: Failure to fetch images.");
      console.log(error);
    }
  };

  const formAddImageSubmit = async (e) => {
    e.preventDefault();
    try {
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
        formData.append("category", category);
        const { data } = await axios.post("/api/images", formData, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });
        setisAddImage(false);
        setAllImages((prev) => [...prev, ...data]);
      }
    } catch (error) {
      // TODO: Add toast notification for adding image submit
      console.log(error);
    }
  };

  const toggleIsAddImage = () => {
    setisAddImage(!isAddImage);
  };

  useEffect(() => {
    fetchImages();
  }, []);

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
            {allImages.map((image, index) => (
              <ImageEdit
                storedImage={image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
