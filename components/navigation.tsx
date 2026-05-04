import Link from "next/link";
import AuthButton from "./authButton";
import NavigationLogo from "./navigationLogo";
import { auth } from "@/auth";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav>
      <div className="fixed top-0 z-50 w-full border-b border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
        <div className="m-auto max-w-6xl overflow-x-scroll sm:overflow-x-hidden">
          <div className="flex">
            <NavigationLogo />
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
            <AuthButton session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
