import "@styles/css/footer.css"

export default function Footer() {
  return (
    <div className="flex justify-center p-10 sm:p-0">
        <footer id="footer">
          <div class="inner flex justify-center">
            <section>
              <h2>Get in touch</h2>
              <form id="inquiry-form" method="post" action="">
                <div class="fields">
                  <input
                    type="hidden"
                    name="_subject"
                    value="New email from Personal Website!"
                  />
                  <input type="hidden" name="_captcha" value="false" />
                  <div class="field half">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div class="field half">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div class="field">
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Message"
                      required
                    ></textarea>
                  </div>
                </div>
                <ul class="actions">
                  <li>
                    <input
                      id="submit-btn"
                      type="submit"
                      value="Send"
                      class="primary"
                    />
                  </li>
                </ul>
              </form>
            </section>
            <ul class="copyright flex justify-center">
              <li>&copy; RKE Construction Inc. All rights reserved</li>
            </ul>
          </div>
        </footer>
    </div>
  );
}
