"use client";
import { Icons } from "@components/Icons";
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'

export default function Login() {
  
  const router = useRouter()
  const [input, setinput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.stopPropagation();

    try {
      await axios.post("/api/admin", input, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setinput({
        email: "",
        password: "",
      });

      window.location.replace('/admin')
      // TODO: add toast notifications for login success
    } catch (err) {
      // TODO: add toast notifications for login failure
      console.log(err);
    }


  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
        <Icons.logo color={"#1b263b"} height={120} width={120} />
      </div>

      <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <div className="mt-2">
              <input
                value={input.email}
                onChange={handleChange}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="pl-3 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1b263b] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <input
                value={input.password}
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                className="pl-3 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1b263b] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="items-center tracking-wide flex w-full justify-center rounded-md bg-[#fc7622] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#fb5607] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            "
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
