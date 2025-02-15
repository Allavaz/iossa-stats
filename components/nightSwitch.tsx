"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function NightSwitch() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setNight(localStorage.getItem("theme") === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setNight(true);
    }
  }, []);

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
    <button
      className="cursor-pointer border-x border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
      onClick={_ => toggleNight()}
    >
      <FontAwesomeIcon icon={night ? faSun : faMoon} />
    </button>
  );
}
