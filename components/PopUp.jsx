import React from "react";

export default function PopUp({ children, togglePopup }) {
  return (
    <div
      onClick={() => togglePopup()}
      className="fixed bg-black bg-opacity-50 left-0 right-0 top-0 bottom-0 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-5 roundede-md flex flex-col items-center justify-center rounded-lg"
      >
        {children}
      </div>
    </div>
  );
}
