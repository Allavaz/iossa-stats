"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faSignOutAlt,
  faDesktop
} from "@fortawesome/free-solid-svg-icons";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

function getThemeLabel(theme) {
  if (theme === "auto") {
    return "Tema automático";
  } else if (theme === "dark") {
    return "Tema oscuro";
  } else {
    return "Tema claro";
  }
}

export default function Navigation() {
  const [theme, setTheme] = useState("auto");
  const [logoShown, setLogoShown] = useState(false);
  const { data: session } = useSession();
  const themeStates = ["light", "dark", "auto"];

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "auto");
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", event => {
        if (!("theme" in localStorage)) {
          // Only update if the user hasn't set an explicit preference
          if (event.matches) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      });
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

  function toggleTheme() {
    let currentIndex = themeStates.indexOf(theme);
    let nextIndex = (currentIndex + 1) % themeStates.length;
    let nextTheme = themeStates[nextIndex];
    setTheme(nextTheme);
    if (nextTheme === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", nextTheme);
    }
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
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
            <Link
              href="/foro"
              className="border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Foro
            </Link>
            <button
              className="min-w-fit cursor-pointer border-l border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              onClick={_ => (session ? signOut() : signIn("discord"))}
            >
              {session ? (
                <div className="flex items-center gap-2">
                  <img
                    className="h-6 w-6 rounded-full"
                    src={session.user.image}
                  />
                  <div>{session.user.name || session.user.email}</div>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faDiscord} />
                  <div className="whitespace-nowrap">Iniciar sesión</div>
                </div>
              )}
            </button>
            <button
              className="w-12 cursor-pointer border-x border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              onClick={_ => toggleTheme()}
              title={getThemeLabel(theme)}
            >
              {theme === "auto" ? (
                <FontAwesomeIcon icon={faDesktop} />
              ) : theme === "dark" ? (
                <FontAwesomeIcon icon={faMoon} />
              ) : (
                <FontAwesomeIcon icon={faSun} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
