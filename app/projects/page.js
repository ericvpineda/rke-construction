"use client";
import { Disclosure, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import c1 from "@public/images/products/kitchen/img1.jpg";
import c2 from "@public/images/products/kitchen/img2.jpg";
import c3 from "@public/images/products/kitchen/img3.jpg";
import b1 from "@public/images/products/bath/img1.jpg";
import b2 from "@public/images/products/bath/img2.jpg";
import b3 from "@public/images/products/bath/img3.jpg";
import b4 from "@public/images/products/bath/img4.jpg";
import b5 from "@public/images/products/bath/img5.jpg";
import b6 from "@public/images/products/bath/img6.jpg";
import d1 from "@public/images/products/dining/img1.jpg";
import d2 from "@public/images/products/dining/img2.jpg";
import d3 from "@public/images/products/dining/img3.jpg";
import d4 from "@public/images/products/dining/img4.jpg";
import d5 from "@public/images/products/dining/img5.jpg";
import e1 from "@public/images/products/exterior/img1.jpg";
import e2 from "@public/images/products/exterior/img2.jpg";
import e3 from "@public/images/products/exterior/img3.jpg";
import e4 from "@public/images/products/exterior/img4.jpg";
import Image from "next/image";

const products = [
  {
    name: "Remodeled Kitchen",
    scrollId: "kitchen",
    dataCompleted: "April 28, 2016",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: c1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: c2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: c3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
        // name: "Features",
        // items: [
        //   "Multiple strap configurations",
        //   "Spacious interior with top zip",
        //   "Leather handle and tabs",
        //   "Interior dividers",
        //   "Stainless strap loops",
        //   "Double stitched construction",
        //   "Water-resistant",
        // ],
      // },
    ],
  },
  {
    name: "Remodeled Bath",
    scrollId: "bath",
    dataCompleted: "January 1, 2010",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: b1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: b2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: b3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: b4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 5,
        name: "Angled view",
        src: b5,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 6,
        name: "Angled view",
        src: b6,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
  {
    name: "Remodeled Dining",
    scrollId: "dining",
    dataCompleted: "January 10, 2010",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: d1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: d2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: d3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: d4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 5,
        name: "Angled view",
        src: d5,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
  {
    name: "Remodeled Exterior",
    scrollId: "exterior",
    dataCompleted: "August 31, 2012",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: e1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: e2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: e3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: e4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Projects() {
  return (
    <div className="bg-white py-16 sm:pt-20 sm:pb-8">
      {/* Heading Text  */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-0">
          Projects
        </h2>
        <p className="text-center mt-6 mb-8 text-lg text-gray-600 leading-7">
          We invest substantial time in meticulous planning. This involves
          comprehensive site assessments, detailed blueprints, and an in-depth
          analysis of materials and resources needed. This rigorous process sets
          the foundation for a seamless construction process.
        </p>
      </div>
      {/* Product Information  */}
      {products.map((product) => (
        <div
          className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
          id={product.scrollId}
        >
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {product.images.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              src={image.src}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-[#1b263b]" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                {product.images.map((image) => (
                  <Tab.Panel key={image.id}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover object-center sm:rounded-lg max-h-[20rem]"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-5">
                {product.name}
              </h1>

              <div className="mt-1">
                <h2 className="sr-only">Product Date Completed</h2>
                <p className="text-lg tracking-tight text-gray-500">
                  Completed: {product.dataCompleted}
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? "text-yellow-400"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6 text-base text-gray-700">
                  <p>{product.description}</p>
                </div>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  {product.details.map((detail) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                              <span
                                className={classNames(
                                  open ? "text-[#1b263b]" : "text-gray-900",
                                  "text-sm font-medium"
                                )}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="block h-6 w-6 text-[#1b263b] group-hover:text-[#1b263b]"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {detail.length > 0 && (
                            <Disclosure.Panel
                              as="div"
                              className="prose prose-sm pb-6"
                            >
                              <ul role="list">
                                {detail.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </Disclosure.Panel>
                          )}
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
