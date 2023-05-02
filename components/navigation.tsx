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
      <div className="fixed top-0 w-full border-b border-neutral-300 bg-white shadow-md dark:border-neutral-600 dark:bg-neutral-800 z-50">
        <div className="m-auto max-w-6xl overflow-x-scroll sm:overflow-x-hidden">
          <div className="flex">
            <Link href="/">
              <a
                className="hidden sm:flex items-center overflow-hidden bg-[#e28800] dark:bg-[#a56200] dark:border-neutral-600"
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
              </a>
            </Link>
            <Link href="/">
              <a className="flex sm:hidden items-center bg-[#e28800] dark:bg-[#a56200] dark:border-neutral-600">
                <img
                  className="min-h-[50px] min-w-[50px] p-1"
                  alt="IOSoccer Sudamérica"
                  src="/logo-solo.png"
                  width="50px"
                />
              </a>
            </Link>
            <Link href="/individuales">
              <a className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700">
                Estadísticas
              </a>
            </Link>
            <Link href="/resultados">
              <a className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700">
                Resultados
              </a>
            </Link>
            <Link href="/torneos">
              <a className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700">
                Torneos
              </a>
            </Link>
            <Link href="/top10">
              <a className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700">
                Rankings
              </a>
            </Link>
            <a
              className="cursor-pointer border-x border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
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
