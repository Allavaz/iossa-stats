"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { signIn, signOut } from "next-auth/react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Session } from "next-auth";

export default function AuthButton({ session }: { session: Session | null }) {
  return (
    <button
      className="min-w-fit cursor-pointer border-x border-neutral-300 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
      onClick={() => (session ? signOut() : signIn("discord"))}
    >
      {session ? (
        <div className="flex items-center gap-2">
          <img
            className="h-6 w-6 rounded-full"
            src={session.user.image || "/default-avatar.png"}
            alt={session.user.name || session.user.email || "User"}
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
  );
}
