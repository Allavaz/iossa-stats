import { notFound } from "next/navigation";
import { isAdmin } from "@/auth";
import { getTeams } from "@/lib/getFromDB";
import TeamsAdmin from "./TeamsAdmin";

export default async function AddTeamsPage() {
  if (!await isAdmin()) notFound();
  const teams = await getTeams();
  return <TeamsAdmin initialTeams={teams} />;
}
