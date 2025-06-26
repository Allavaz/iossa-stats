import Link from "next/link";

export default function Header() {
  return (
    <div
      id="header"
      className="mb-4 mt-12 hidden border-b-2 border-orange-300 bg-[#ff9800] dark:border-[#ff9800] dark:bg-[#a56200] dark:shadow-[0_0_100vh_#a56200] sm:flex"
    >
      <div className="m-auto w-full max-w-6xl">
        <Link href="/" className="flex w-fit py-5">
          <img
            className="h-20"
            src="/Logotipo_IOSSA.png"
            alt="IOSoccer Sudamérica"
          />
        </Link>
      </div>
    </div>
  );
}
