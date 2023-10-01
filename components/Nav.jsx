"use client";
import { Disclosure, Transition } from "@headlessui/react";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Projects", href: "/projects", current: false },
  // { name: "Pricing", href: "/pricing", current: false },
  { name: "About", href: "/about", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const pathname = usePathname();
  return (
    <Disclosure as="nav" className="theme_blue">
      {() => (
        <>
          <div className="mx-auto max-w-[84rem] px-2 sm:px-6 lg:px-8 pr-4 flex items-center">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center sm:pl-0 hidden sm:block"
            >
              <Icons.logo/>
            </Link>
            <div className="flex flex-col w-full items-end">
              <div className="max-w-7xl text-white pt-5">
                <span className="flex justify-end">
                  <span className="hidden sm:inline">(xxx)-xxx-xxxx |</span> &nbsp;xxx@gmail.com
                </span>
              </div>
              <div className="relative flex h-12 py-10 items-center justify-end w-full sm:w-0">
                <div className="flex items-center sm:hidden ">
                  {/* Mobile menu button*/}

                  <Disclosure.Button className="pr-5 relative inline-flex items-center justify-start rounded-md p-2 text-gray-400 hover:text-white !ring-0 ">
                    <Icons.logo />
                  </Disclosure.Button>
                </div>

                {/* Desktop view  */}
                <div className="flex flex-1 items-center justify-center sm:justify-between sm:items-center">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            pathname == item.href
                              ? "border-solid border-white border-b-2 hover:text-white"
                              : " hover:text-white  hover:border-solid hover:border-b-2 hover:border-gray-300",
                            "px-3 py-2 text-md font-medium rounded-none text-white"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="inline-block sm:hidden">
                  <Link
                    href="/"
                    className={classNames(
                      buttonVariants({ variant: "outline" }),
                      "ml-7 whitespace-nowrap"
                    )}
                  >
                    CALL NOW
                  </Link>
                </div>
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
                      pathname == item.href
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
