"use client";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About", href: "/about", current: false },
  { name: "Projects", href: "/projects", current: false },
  { name: "Pricing", href: "/pricing", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  return (
    <Disclosure as="nav" className="theme_blue">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-[84rem] px-2 sm:px-6 lg:px-8 pr-4">
            <div className="max-w-7xl text-white pt-5 mx-auto">
              <span className="flex justify-end">
                (xxx)-xxx-xxxx | xxx@gmail.com
              </span>
            </div>
            <div className="relative flex h-12 py-10 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden ">
                {/* Mobile menu button*/}

                <Disclosure.Button className="pr-5 relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white !ring-0 ">
                  <Icons.logo />
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:justify-between sm:items-center">
                <Link
                  href="/"
                  className="flex flex-shrink-0 items-center pl-10 sm:pl-0 hidden sm:block"
                >
                  <Icons.logo />
                </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="">
                <Link
                  href="/"
                  className={buttonVariants({ variant: "outline" })}
                >
                  CALL NOW
                </Link>
              </div>
            </div>
          </div>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
