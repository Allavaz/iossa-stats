import Link from "next/link";

export default function Header() {
  return (
    <div id="header">
      <div className="headerContent">
        <Link href="/" passHref>
          <img src="/logo-iossa.png" alt="IOSoccer Sudamérica"></img>
        </Link>
      </div>
    </div>
  );
}
