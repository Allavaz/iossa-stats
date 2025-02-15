"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo() {
  const [logoShown, setLogoShown] = useState(false);

  useEffect(() => {
    const header = document.querySelector("#header")!;
    const observer = new IntersectionObserver(hideLogo);
    observer.observe(header);
  }, []);

  function hideLogo(entries) {
    if (entries[0].isIntersecting) {
      setLogoShown(false);
    } else {
      setLogoShown(true);
    }
  }

  return (
    <Link
      href="/"
      className="hidden items-center overflow-hidden bg-[#e28800] dark:border-neutral-700 dark:bg-[#a56200] sm:flex"
      style={{
        width: logoShown ? "50px" : "0px",
        transition: "width .2s ease-in"
      }}
      onScroll={hideLogo}
    >
      <img
        className="min-h-[50px] min-w-[50px] p-1"
        alt="IOSoccer Sudamérica"
        src="/logo-solo.png"
        width="50px"
      />
    </Link>
  );
}
