import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faCaretDown,
  faCaretUp
} from "@fortawesome/free-solid-svg-icons";

const mobileWidth = 550;

export default function Navigation() {
  const [night, setNight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [logoShown, setLogoShown] = useState(false);
  const [hamburger, setHamburger] = useState(false);

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
    window.addEventListener("click", hamburgerCloseWhenClickingAway);
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

  function hamburgerCloseWhenClickingAway(e) {
    if (e.clientY > 110) {
      setHamburger(false);
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
    <div id="nav-div" onScroll={hideLogo}>
      <div className="headerContent">
        <div className="nav-contents">
          <Link
            href="/"
            id="nav-logo"
            onClick={e => setHamburger(false)}
            style={{
              width: logoShown || mobile ? "50px" : "0",
              transition: mobile ? "all 0s" : "all .2s ease-in"
            }}
            passHref
          >
            <img
              alt="IOSoccer Sudamérica"
              src="/logo-solo.png"
              height="40px"
              width="40px"
            />
          </Link>
          <Link
            href="/individuales"
            id="nav-item"
            onClick={e => setHamburger(false)}
            style={{ borderLeft: "1px solid var(--button-border)" }}
            passHref
          >
            <center>Estadísticas</center>
          </Link>
          <Link
            href="/resultados"
            id="nav-item"
            onClick={e => setHamburger(false)}
            passHref
          >
            <center>Resultados</center>
          </Link>
          <div
            className="hamburger"
            id="nav-item"
            onClick={e => setHamburger(!hamburger)}
          >
            <center>
              <FontAwesomeIcon icon={hamburger ? faCaretUp : faCaretDown} />
            </center>
          </div>
          <div
            className="linebreak"
            style={{ display: hamburger ? "block" : "none" }}
          />
          <Link
            href="/posiciones"
            id="nav-item"
            onClick={e => setHamburger(false)}
            style={{ display: hamburger || !mobile ? "block" : "none" }}
            passHref
          >
            <center>Posiciones</center>
          </Link>
          <Link
            href="/top10"
            id="nav-item"
            onClick={e => setHamburger(false)}
            style={{ display: hamburger || !mobile ? "block" : "none" }}
            passHref
          >
            <center>Rankings</center>
          </Link>
          <button
            id="nav-item"
            onClick={e => toggleNight()}
            style={{ display: hamburger || !mobile ? "block" : "none" }}
          >
            <center>
              <FontAwesomeIcon
                style={{ display: "block" }}
                icon={night ? faSun : faMoon}
              />
            </center>
          </button>
        </div>
      </div>
    </div>
  );
}
