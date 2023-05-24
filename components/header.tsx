import Link from "next/link";

export default function Header() {
  return (
    <div
      id="header"
      className="mb-4 mt-12 hidden h-28 border-b-2 border-orange-300 bg-[#ff9800] dark:border-[#ff9800] dark:bg-[#a56200] dark:shadow-[0_0_100vh_#a56200] sm:flex"
    >
      <div className="m-auto w-full max-w-6xl">
        <Link href="/">
          <a>
            <img src="/logo-iossa.png" alt="IOSoccer Sudamérica"></img>
          </a>
        </Link>
      </div>
    </div>
  );
}
