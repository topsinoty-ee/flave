/** @format */
import Link from "next/link";

import { Logo } from "./logo";

export const Footer = () => (
  <footer className="flex w-full py-20 text-gray-200 bg-black text-white min-h-[40%] max-h-96 place-content-between">
    <div className="flex flex-col gap-6 w-80">
      <div className="max-w-45">
        {<Logo type="dark" className="max-h-30" />}
      </div>

      <div>
        <p className="text-white">
          At Flave, we make cooking simple and enjoyable for everyone. Join us
          in sharing recipes and creating meals that bring people together.
        </p>
      </div>
    </div>
    <section className={`flex gap-20 max-w-max`}>
      <div className="flex flex-col gap-4">
        <h3 className="text-white">Have Questions?</h3>
        <nav className="flex flex-col gap-2">
          <Link href="mailto:oluwatobilobatemi05@gmail.com">Contact us</Link>
          <Link href="/FAQ">FAQ</Link>
        </nav>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-white">Other Information</h3>
        <nav className="flex flex-col gap-2">
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms-of-use">Terms of use</Link>
        </nav>
      </div>
    </section>
  </footer>
);
