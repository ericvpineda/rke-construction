import { Room } from "@prisma/client";
import PopUp from "@components/PopUp";
import { useState } from "react";

export default function ImageForm({
  action,
  togglePopupHandler,
  formSubmitHandler,
  defaultVals = {},
}) {
  const isEditForm = Object.keys(defaultVals).length > 0;
  const [editImageName, seteditImageName] = useState(
    isEditForm ? defaultVals.name : ""
  );
  return (
    <PopUp togglePopup={togglePopupHandler}>
      <h1 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
        {action} Image
      </h1>
      <form
        encType="multipart/form-data"
        onSubmit={formSubmitHandler}
        className="flex flex-col justify-center "
      >
        {!isEditForm && (
          <input
            id="files"
            type="file"
            name="files[]"
            multiple={!isEditForm}
            accept=".pdf, .jpg, .jpeg, .png"
            required
            className="mb-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        )}

        {isEditForm && (
          <>
            <input
              id="editFiles"
              type="file"
              name="files[]"
              multiple={!isEditForm}
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => seteditImageName(e.target.files[0].name)}
              required
              className="hidden "
            />
            <label
              htmlFor="editFiles"
              className="px-[0.05rem] py-2.5 bg-[#1f2937] mb-3 block w-full text-sm text-gray-900 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            >
              <span className="px-3 py-2.5 text-white">Choose file</span>
              <span className="px-4 py-2.5 bg-gray-50 rounded-r-lg">
                {editImageName.slice(0, 15)}
              </span>
            </label>
          </>
        )}

        <select
          id="categories"
          class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          name="selected"
          required
        >
          <option selected={!isEditForm} disabled className="lowercase">
            Choose a category
          </option>
          {Object.keys(Room).map((room) => (
            <option
              value={room}
              className="p-2"
              selected={isEditForm && defaultVals.category.includes(room)}
            >
              {room}
            </option>
          ))}
        </select>
        <button className="button_custom">{action}</button>
      </form>
    </PopUp>
  );
}
