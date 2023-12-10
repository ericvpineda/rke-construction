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
            className="cursor-pointer mb-3 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
            file:bg-gray-50 file:border-0
            file:bg-gray-100 file:me-4
            file:py-3 file:px-4
            file:bg-[#1f2937]
            file:text-white
            dark:file:bg-gray-700 dark:file:text-gray-400 file:font-bold"
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
              className="hidden"
            />
            <label
              htmlFor="editFiles"
              className="max-w-[15rem] pr-4 truncate bg-[#1f2937] mb-3 flex w-full text-sm text-gray-900 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            >
              <div className="px-3 py-2.5 text-white font-normal">Choose file</div>
              <div className="pr-3 pl-4 py-2.5 bg-gray-50 border-2 border-solid min-w-full font-normal">
                {editImageName}
              </div>
            </label>
          </>
        )}

        <select
          id="categories"
          class="cursor-pointer mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          name="selected"
          required
        >
          <option selected={!isEditForm} disabled className="lowercase cursor-pointer">
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
        <button className="button_custom w-full min-w-[15rem] !text-white" >{action}</button>
      </form>
    </PopUp>
  );
}
