"use client";
import { Disclosure, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import {classNames} from "@lib/utils"
import Image from "next/image";
import {products} from "@lib/products"

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
      {products.map((product, idx) => (
        <div
          key={idx}
          className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
          id={product.scrollId}
        >
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-6">
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
