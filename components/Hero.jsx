import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-hero bg-cover bg-no-repeat w-full">
      <div className="absolute bg-black w-full h-full bg-opacity-50 text-white flex justify-center items-center font-bold flex-col">
        <p className="xl:flex-row gap-2 mb-4 flex flex-col jusitify-center items-center -mt-20 sm:-mt-10">
          <span className="text-center text-2xl sm:text-5xl lg:text-6xl">Elevate Your Vision with</span>
          <span className="text-[#fc7622] text-center text-4xl sm:text-5xl lg:text-6xl">RKE Construction.</span>
        </p>
        <p className="md:text-lg lg:text-xl xl:text-2xl mb-14 text-center hidden md:block md:px-4">
          RKE Construction is a premier construction company dedicated to
          transforming architectural visions into tangible, enduring structures.{" "}
        </p>
        <Link
          href="/search"
          className="uppercase tracking-wide font-bold text-lg px-4 py-2 rounded-md text-white !hover:text-white !shadow-none border-white border-2 border-solid"
        >
          See Craftmanship
        </Link>
      </div>
    </div>
  );
}
