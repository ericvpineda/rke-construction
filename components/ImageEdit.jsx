import { useState } from "react";
import Image from "next/image";
import ImageForm from "./ImageForm";
import axios from "axios";

export default function ImageEdit({ storedImage }) {
  const [isEditImage, setisEditImage] = useState(false);
  const [image, setimage] = useState(storedImage)

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
        
        formData.append("prevImageName", image.name);
        formData.append("category", category.toLowerCase());
        console.log("DEBUG: image=", image)
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
        setimage(data)
      } catch (error) {
        // TODO: Add toast notification for edit image submit
        console.log(error);
      }
    }
  };

  const toggleIsEditImage = () => {
    setisEditImage(!isEditImage);
  };

  return (
    <div
      key={image.id}
      className="grid lg:grid-cols-5 grid-cols-3 items-center justify-center"
    >
      {isEditImage && (
        <ImageForm
          togglePopupHandler={toggleIsEditImage}
          formSubmitHandler={formEditImageSubmit}
          defaultVals={image}
          action="Edit"
        />
      )}
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
        <button
          onClick={() => {
            toggleIsEditImage();
          }}
          className="font-bold uppercase text-[#023e8a] hover:text-[#1b263b] underline decoration-[#023e8a] hover:decoration-[#1b263b]  decoration-1 decoration-solid"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
