import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo-solo.png";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const mobileWidth = 550;

export default function Navigation() {
  const [night, setNight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [logoShown, setLogoShown] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", hideLogo);
    if (window.innerWidth < mobileWidth) {
      setMobile(true);
    }
    if (localStorage.getItem("theme")) {
      setNight(localStorage.getItem("theme") === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setNight(true);
    }
    window.addEventListener("resize", changeMobile);
  }, []);

  function hideLogo() {
    if (!mobile && window.scrollY >= 100) {
      setLogoShown(true);
    } else {
      setLogoShown(false);
    }
  }

  function changeMobile() {
    if (window.innerWidth < mobileWidth) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }

  function toggleNight() {
    if (document.documentElement.getAttribute("data-theme") !== "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setNight(true);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setNight(false);
    }
  }

  return (
    <nav id="nav-div" onScroll={hideLogo}>
      <div className="headerContent">
        <div className="nav-contents">
          <Link href="/">
            <a
              style={{
                width: logoShown || mobile ? "50px" : "0",
                transition: mobile ? "all 0s" : "all .2s ease-in"
              }}
            >
              <div style={{ padding: "5px" }}>
                <Image
                  alt="IOSoccer Sudamérica"
                  src={logo}
                  height="40px"
                  width="40px"
                  layout="fixed"
                ></Image>
              </div>
            </a>
          </Link>
          <Link href="/individuales">
            <a style={{ borderLeft: "1px solid var(--button-border)" }}>
              <center>Estadísticas</center>
            </a>
          </Link>
          <Link href="/resultados">
            <a>
              <center>Resultados</center>
            </a>
          </Link>
          <Link href="/posiciones">
            <a>
              <center>Posiciones</center>
            </a>
          </Link>
          <Link href="/top10">
            <a>
              <center>Rankings</center>
            </a>
          </Link>
          <a onClick={e => toggleNight()}>
            <center>
              <FontAwesomeIcon icon={night ? faSun : faMoon} />
            </center>
          </a>
        </div>
      </div>
    </nav>
  );
}
