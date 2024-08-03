"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function Navigation() {
  const [night, setNight] = useState(false);
  const [logoShown, setLogoShown] = useState(false);

  useEffect(() => {
    const header = document.querySelector("#header")!;
    const observer = new IntersectionObserver(hideLogo);
    observer.observe(header);
    if (localStorage.getItem("theme")) {
      setNight(localStorage.getItem("theme") === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setNight(true);
    }
  }, []);

  function hideLogo(entries) {
    if (entries[0].isIntersecting) {
      setLogoShown(false);
    } else {
      setLogoShown(true);
    }
  }

  function toggleNight() {
    if (localStorage.getItem("theme") === "light" || !night) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setNight(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setNight(false);
    }
  }

  return (
    <nav onScroll={hideLogo}>
      <div className="fixed top-0 z-50 w-full border-b border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
        <div className="m-auto max-w-6xl overflow-x-scroll sm:overflow-x-hidden">
          <div className="flex">
            <Link
              href="/"
              className="hidden items-center overflow-hidden bg-[#e28800] dark:border-neutral-700 dark:bg-[#a56200] sm:flex"
              style={{
                width: logoShown ? "50px" : "0px",
                transition: "width .2s ease-in"
              }}
            >
              <img
                className="min-h-[50px] min-w-[50px] p-1"
                alt="IOSoccer Sudamérica"
                src="/logo-solo.png"
                width="50px"
              />
            </Link>
            <Link
              href="/"
              className="flex items-center bg-[#e28800] dark:border-neutral-700 dark:bg-[#a56200] sm:hidden"
            >
              <img
                className="min-h-[50px] min-w-[50px] p-1"
                alt="IOSoccer Sudamérica"
                src="/logo-solo.png"
                width="50px"
              />
            </Link>
            <Link
              href="/individuales"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Estadísticas
            </Link>
            <Link
              href="/resultados"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Resultados
            </Link>
            <Link
              href="/torneos"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Torneos
            </Link>
            <Link
              href="/palmares"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Palmarés
            </Link>
            <Link
              href="/top10"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Rankings
            </Link>
            <Link
              href="/reglas"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Reglas
            </Link>
            <a
              className="cursor-pointer border-x border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              onClick={_ => toggleNight()}
            >
              <FontAwesomeIcon icon={night ? faSun : faMoon} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
