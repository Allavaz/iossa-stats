"use client";

import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { voteComment } from "./actions";
import { useSession } from "next-auth/react";

export default function Vote({
  message,
  type
}: {
  message: any;
  type: "like" | "dislike";
}) {
  const count = message.voteCounts[type + "s"];
  const { data: session } = useSession();
  const disabled =
    !session?.user?.email || message.email === session.user.email;

  let vote = null;
  if (session?.user?.email && message.votes) {
    let votesByMe = Object.entries(message.votes).find(
      v => v[0] === session.user.email
    );
    if (votesByMe) {
      vote = votesByMe[1];
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={disabled}
        onClick={async () => {
          await voteComment(message._id, type);
        }}
        className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <FontAwesomeIcon
          icon={type === "like" ? faThumbsUp : faThumbsDown}
          className={`${type === "like" ? "text-green-500" : "text-red-500"} ${
            vote !== type && "opacity-60"
          } hover:opacity-100`}
        />
      </button>
      <div>{count}</div>
    </div>
  );
}
