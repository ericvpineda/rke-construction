import "bootstrap/dist/css/bootstrap.min.css";
import "@styles/css/globals.css";
import { Inter } from "next/font/google";
import Nav from "@components/Nav";
import { classNames } from "@lib/utils";
import Providers from "@components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RKE Construction Website",
  description: "Ernie Pineda contruction website.",
};

// Note: Layout component is server component by default
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={classNames(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <Providers>
        <body className="min-h-screen bg-slate-50 antialiased">
          <Nav />
          {children}
        </body>
      </Providers>
    </html>
  );
}
