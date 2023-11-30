"use client";
import "@styles/css/footer.css";
import { useState } from "react";

export default function Footer() {
  const [buttonText, setbuttonText] = useState("Send");
  const [formValues, setformValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("DEBUG: pre submit=", formValues)
    const response = await fetch(`/api/email`, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("DEBUG: ", data)
      setformValues({
        name: "",
        email: "",
        message: "",
      });
      setbuttonText("Sent!");
    } else {
      setbuttonText("Error.");
    }

    setTimeout(() => setbuttonText("Send"), 1000);
  };

  return (
    <div className="flex justify-center m-0 w-full">
      <footer id="footer" className="p-10 sm:p-16 sm:w-3/5">
        <div className="inner flex flex-col justify-center">
          <h2>Get in touch</h2>
          <form
            onSubmit={formSubmitHandler}
            id="inquiry-form"
            method="post"
            action="https://formsubmit.co/ericvpineda@berkeley.edu"
          >
            <div className="fields">
              <input
                type="hidden"
                name="_subject"
                value="New email from Personal Website!"
              />
              <input type="hidden" name="_captcha" value="false" />
              <div className="field half">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={formValues.name}
                  onChange={(e) =>
                    setformValues({ ...formValues, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field half">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={(e) =>
                    setformValues({ ...formValues, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Message"
                  value={formValues.message}
                  onChange={(e) =>
                    setformValues({ ...formValues, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>
            </div>
            <ul className="actions">
              <li>
                <button id="submit-btn" type="submit" className="primary">
                  {buttonText}
                </button>
              </li>
            </ul>
          </form>
          <ul className="copyright flex justify-center">
            <li>&copy; RKE Construction Inc. All rights reserved</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
