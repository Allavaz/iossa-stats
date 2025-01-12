import { auth } from "@/auth";
import Card from "@/components/ui/card";
import { getMessages, getPageCount } from "@/lib/forum";
import { getTeamLogo } from "@/utils/Utils";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "./form";
import Title from "@/components/ui/title";
import Button from "@/components/ui/button";
import { redirect } from "next/navigation";
import { voteComment } from "./actions";
import Vote from "./vote";

export default async function Foro({ searchParams }) {
  const session = await auth();
  const pageCount = await getPageCount();
  const currentPage = parseInt(searchParams.page || 1);
  const messages = await getMessages(currentPage);

  if (currentPage > pageCount || currentPage < 1 || isNaN(currentPage)) {
    return redirect("/foro");
  }

  return (
    <div className="flex flex-col gap-2">
      <Title>Foro IOSoccer Sudamerica</Title>
      {session ? (
        <Form />
      ) : (
        <div className="w-full text-center font-bold">
          Inicia sesión para participar
        </div>
      )}
      <div className="my-2 w-full border-t border-dashed border-neutral-300 dark:border-neutral-600" />
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: pageCount }, (_, i) => (
          <Button
            disabled={i + 1 === currentPage}
            key={i}
            href={`/foro?page=${i + 1}`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          {messages.map(message => (
            <Message
              key={message._id.toString()}
              message={message}
              email={session?.user?.email}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function Message({ message, email }) {
  return (
    <div className="flex gap-8">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div className="font-bold">{message.user}</div>
        <img
          className="h-[64px]"
          src={getTeamLogo(message.team)}
          alt={message.team}
        />
        <div className="text-sm">{new Date(message.date).toLocaleString()}</div>
        <div className="flex w-full justify-evenly">
          <Vote
            message={{ ...message, _id: message._id.toString() }}
            type="like"
          />
          <Vote
            message={{ ...message, _id: message._id.toString() }}
            type="dislike"
          />
        </div>
      </div>
      <div>{message.content}</div>
    </div>
  );
}
