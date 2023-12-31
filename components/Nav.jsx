"use client";
import { Disclosure, Transition } from "@headlessui/react";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { classNames } from "@lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const loggedOutLinks = [
  { name: "Home", href: "/" },
  { name: "Images", href: "/search" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Login", href: "/login" },
];

const loggedInLinks = [
  { name: "Home", href: "/" },
  { name: "Images", href: "/search" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Admin", href: "/admin" },
  { name: "Logout", href: "#" },
]

export default function Nav() {
  const pathname = usePathname();
  const [isverified, setisverified] = useState(false);
  const [navigation, setnavigation] = useState(loggedOutLinks);

  const verifyAdminAuth = async () => {
    try {
      const { data } = await axios.get("/api/admin", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setisverified(data.isVerified);
      if (data.isVerified) {
        setnavigation(loggedInLinks);
      } else {
        setnavigation(loggedOutLinks);
      }
    } catch (error) {
      setnavigation(loggedOutLinks);
      setisverified(false);
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.delete("/api/admin", {
        headers: { "Content-Type": "application/json" },
      });
      window.location.replace("/login");
      toast.success("Logout success!");
      setnavigation(loggedOutLinks);
      setisverified(false);
    } catch (error) {
      toast.error("Logout failure.");
      setnavigation(loggedOutLinks);
    }
  };

  // Note: Will run on every render to
  useEffect(() => {
    verifyAdminAuth();
  }, [isverified]);

  return (
    <Disclosure as="nav" className="theme_blue">
      {() => (
        <>
          <div className="mx-auto max-w-[84rem] sm:px-6 lg:px-8 flex items-center pr-4">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center sm:pl-0 hidden sm:block"
            >
              <Icons.logo />
            </Link>
            <div className="flex flex-col w-full items-end">
              <div className="max-w-7x pt-3 sm:pt-5">
                <span className="flex justify-end text-white">
                  <span className="hidden sm:inline">
                    <Link href="tel:+14085504169">(408)-550-4169</Link> |
                  </span>{" "}
                  &nbsp;
                  <Link href="mailto:handybones@yahoo.com">
                    handybones@yahoo.com
                  </Link>
                </span>
              </div>
              <div className="relative flex h-12 py-10 items-center justify-end w-full sm:w-0">
                <div className="flex items-center sm:hidden ">
                  {/* Mobile menu button*/}

                  <Disclosure.Button className="ml-5 pr-5 relative inline-flex items-center justify-start rounded-md p-2 text-gray-400 hover:text-white !ring-0 ">
                    <Icons.hamburger />
                  </Disclosure.Button>
                </div>

                {/* Desktop view  */}
                <div className="flex flex-1 items-center justify-center sm:justify-between sm:items-center">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => {
                        if (item.name !== "Login" && item.name !== "Logout") {
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                pathname == item.href
                                  ? "nav_button_selected"
                                  : "nav_button_hover",
                                "nav_button"
                              )}
                              prefetch={
                                item.name === "Images" || item.name === "Admin"
                              }
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          );
                        } else {
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="auth_button_hover auth_button"
                              onClick={isverified ? logoutHandler : null}
                              aria-current="page"
                            >
                              {item.name}
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>

                <div className="inline-block sm:hidden">
                  <a
                    href="tel:+14085504169"
                    className={classNames(
                      buttonVariants({ variant: "outline" }),
                      "ml-7 whitespace-nowrap"
                    )}
                  >
                    CALL NOW
                  </a>
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
            {/* Mobile Buttons  */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => {
                  if (item.name !== "Login" && item.name !== "Logout") {
                    return (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          pathname == item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "nav_mobile_dropdown"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    );
                  } else {
                    return (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={isverified ? logoutHandler : null}
                        className="nav_mobile_dropdown auth_button auth_button_hover"
                        aria-current="page"
                      >
                        {item.name}
                      </Disclosure.Button>
                    );
                  }
                })}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
