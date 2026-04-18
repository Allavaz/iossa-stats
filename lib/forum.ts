import { Prisma } from "./generated/prisma";
import prisma from "./prisma";

const PAGE_SIZE = 10;

type NewMessage = { email: string; user: string; team: string; content: string };

export async function pushMessage(message: NewMessage) {
  return prisma.forumMessage.create({
    data: {
      date: new Date(),
      email: message.email,
      user: message.user,
      team: message.team,
      content: message.content,
      votes: {} as Prisma.JsonObject,
    },
  });
}

export async function getMessages(page?: number) {
  const skip = page && page > 1 ? (page - 1) * PAGE_SIZE : 0;
  const docs = await prisma.forumMessage.findMany({
    orderBy: { date: "desc" },
    skip,
    take: PAGE_SIZE,
  });
  return docs.map(doc => {
    const votes = (doc.votes as Record<string, string>) ?? {};
    return {
      ...doc,
      _id: doc.id,
      date: doc.date.toISOString(),
      voteCounts: {
        likes: Object.values(votes).filter(v => v === "like").length,
        dislikes: Object.values(votes).filter(v => v === "dislike").length,
      },
    };
  });
}

export async function getPageCount() {
  const count = await prisma.forumMessage.count();
  return Math.ceil(count / PAGE_SIZE);
}

export async function pushVote(id: string, vote: "like" | "dislike", email: string) {
  const doc = await prisma.forumMessage.findUnique({ where: { id } });
  if (!doc) throw new Error("Message not found");
  const votes = (doc.votes as Record<string, string>) ?? {};
  if (email in votes && votes[email] === vote) {
    delete votes[email];
  } else {
    votes[email] = vote;
  }
  return prisma.forumMessage.update({ where: { id }, data: { votes } });
}

export async function getMessage(id: string) {
  const doc = await prisma.forumMessage.findUnique({ where: { id } });
  if (!doc) return null;
  return { ...doc, _id: doc.id };
}
