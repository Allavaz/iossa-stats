import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const mobileWidth = 550;

export default function Navigation() {
  const [night, setNight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [logoShown, setLogoShown] = useState(false);

  useEffect(() => {
    let header = document.querySelector("#header");
    let observer = new IntersectionObserver(hideLogo);
    observer.observe(header);
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

  function hideLogo(entries) {
    if (entries[0].isIntersecting) {
      setLogoShown(false);
    } else {
      setLogoShown(true);
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
              className="home-link"
              style={{
                width: logoShown ? "50px" : "0px",
                transition: mobile ? "all 0s" : "width .2s ease-in"
              }}
            >
              <img
                alt="IOSoccer Sudamérica"
                src="/logo-solo.png"
                height="40px"
                width="40px"
              />
            </a>
          </Link>
          <div className="scrollable-nav-items">
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
            <Link href="/torneos">
              <a>
                <center>Torneos</center>
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
      </div>
    </nav>
  );
}
