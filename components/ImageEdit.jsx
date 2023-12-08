import { useState } from "react";
import Image from "next/image";
import ImageForm from "./ImageForm";
import axios from "axios";
import PopUp from "./PopUp";
import { classNames } from "@lib/utils";
import { forwardRef } from "react";

const ImageEdit = forwardRef(({ storedImage }, ref) => {
  const [isEditImage, setisEditImage] = useState(false);
  const [isDeleteImage, setisDeleteImage] = useState(false);
  const [image, setimage] = useState(storedImage);
  const [isRemoved, setisRemoved] = useState(false);
  const [isZoom, setisZoom] = useState(false);

  const formEditImageSubmit = async (e) => {
    e.preventDefault();
    const images = e.target.editFiles.files;
    const index = e.target.selected.selectedIndex;
    const category = e.target.selected[index].text;

    if (images.length == 0 && category === image.category[0]) {
      console.log("DEBUG: Image and category are the same.");
      toggleIsEditImage();
    } else {
      try {
        const formData = new FormData();

        if (images.length > 0) {
          for (let image of images) {
            formData.append("images", image);
            formData.append("imageNames", image.name);
          }
        }

        formData.append("prevUrl", image.url);
        formData.append("category", category.toLowerCase());
        const { data } = await axios.patch(
          `/api/images/${image.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );

        setisEditImage(false);
        setimage(data);
      } catch (error) {
        // TODO: Add toast notification for edit image submit
        console.log(error);
      }
    }
  };

  const deleteImage = async () => {
    try {
      console.log("DEBUG: id=", storedImage);
      await axios.delete(`/api/images/${storedImage.id}`);
      setisDeleteImage(false);
      setisRemoved(true);
    } catch (error) {
      // TODO: Add toast notification for delete image submit
      console.log(error);
    }
  };

  const toggleIsEditImage = () => {
    setisEditImage(!isEditImage);
  };

  const toggleIsDeleteImage = () => {
    setisDeleteImage(!isDeleteImage);
  };

  const toggleZoom = () => {
    setisZoom(!isZoom);
  };

  return (
    <div
      ref={ref}
      key={image.id}
      className={classNames(
        "grid lg:grid-cols-5 grid-cols-3 items-center justify-center",
        isRemoved ? "hidden" : ""
      )}
    >
      {isZoom && (
        <div className="popup_bg" onClick={toggleZoom}>
          <Image
            onClick={(e) => e.stopPropagation()}
            src={image.url}
            height={400}
            width={400}
            className="rounded-lg object-cover
            min-w-[20rem] max-w-[20rem] min-h-[20rem] max-h-[20rem]    
            md:min-h-[25rem] md:max-h-[25rem] md:min-w-[25rem] md:max-w-[25rem]
            xl:min-h-[30rem] xl:max-h-[30rem] xl:min-w-[30rem] xl:max-w-[30rem]
            "
          />
        </div>
      )}

      {isEditImage && (
        <ImageForm
          togglePopupHandler={toggleIsEditImage}
          formSubmitHandler={formEditImageSubmit}
          defaultVals={image}
          action="Edit"
        />
      )}

      {isDeleteImage && (
        <PopUp togglePopup={toggleIsDeleteImage}>
          <h1 className="text-xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
            Are you sure?
          </h1>
          <div className="flex gap-2">
            <button
              onClick={deleteImage}
              className="bg-[#0a9396] hover:bg-[#005f73] button_custom_skeleton"
            >
              Yes
            </button>
            <button
              onClick={toggleIsDeleteImage}
              className="bg-[#ae2012] hover:bg-[#9b2226] button_custom_skeleton"
            >
              No
            </button>
          </div>
        </PopUp>
      )}

      <div className="whitespace-nowrap py-4  text-sm font-medium text-gray-900 sm:pl-0 text-center flex justify-center">
        <Image
          onClick={toggleZoom}
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
      <div className="whitespace-nowrap py-4 pl-3 !pr-20 text-right text- font-medium sm:pr-0 flex flex-col gap-2">
        <button
          onClick={() => {
            toggleIsEditImage();
          }}
          className="font-bold uppercase text-[#023e8a] hover:text-[#1b263b] underline decoration-[#023e8a] hover:decoration-[#1b263b]  decoration-1 decoration-solid"
        >
          Edit
        </button>
        <button
          onClick={() => {
            toggleIsDeleteImage();
          }}
          className="font-bold uppercase text-[#c1121f] hover:text-[#780000] underline decoration-[#c1121f] hover:decoration-[#780000]  decoration-1 decoration-solid"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default ImageEdit;
