import "@styles/css/footer.css"

export default function Footer() {
  return (
    <div className="flex justify-center m-0 w-full">
        <footer id="footer" className="p-10 sm:p-16 sm:w-3/5">
          <div className="inner flex flex-col justify-center">
              <h2>Get in touch</h2>
              <form id="inquiry-form" method="post" action="">
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
                      required
                    />
                  </div>
                  <div className="field half">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="field">
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Message"
                      required
                    ></textarea>
                  </div>
                </div>
                <ul className="actions">
                  <li>
                    <input
                      id="submit-btn"
                      type="submit"
                      value="Send"
                      className="primary"
                    />
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
