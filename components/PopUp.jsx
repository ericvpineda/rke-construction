import React from "react";

export default function PopUp({ children, togglePopup }) {
  return (
    <div
      onClick={() => togglePopup()}
      className="popup_bg"
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
