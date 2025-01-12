"use server";

import { getMessage, pushMessage, pushVote } from "@/lib/forum";
import Teams from "../../utils/Teams.json";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function sendComment(formData: FormData) {
  const session = await auth();

  if (!session) {
    return "Not authenticated";
  }

  const rawFormData = {
    name: formData.get("name"),
    team: formData.get("team"),
    message: formData.get("message")
  };

  rawFormData.name = rawFormData.name.toString().trim();
  rawFormData.message = rawFormData.message.toString().trim();

  if (rawFormData.name.length < 3) {
    return "Nombre muy corto";
  }

  if (rawFormData.message.length < 10) {
    return "Mensaje muy corto";
  }

  if (rawFormData.message.length > 1000) {
    return "Mensaje muy largo";
  }

  if (!Object.keys(Teams).includes(rawFormData.team.toString())) {
    return "Equipo inválido";
  }

  const message = {
    date: new Date(),
    email: session.user.email,
    user: rawFormData.name,
    team: rawFormData.team.toString(),
    content: rawFormData.message,
    votes: {}
  };

  await pushMessage(message);

  revalidatePath("/foro");
}

export async function voteComment(id: string, vote: "like" | "dislike") {
  const session = await auth();

  if (!session) {
    return "Not authenticated";
  }

  const message = await getMessage(id);

  if (message.email === session.user.email) {
    return "No puedes votar tu propio mensaje";
  }

  const objId = new ObjectId(id);

  await pushVote(objId, vote, session.user.email);

  revalidatePath("/foro");
}
