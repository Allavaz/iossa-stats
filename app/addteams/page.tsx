import { notFound } from "next/navigation";
import { isAdmin } from "@/auth";
import { getTeams, getTeamMatchCounts } from "@/lib/getFromDB";
import TeamsAdmin from "./TeamsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar equipos"
};

export default async function AddTeamsPage() {
  if (!(await isAdmin())) notFound();
  const [teams, matchCounts] = await Promise.all([
    getTeams(),
    getTeamMatchCounts()
  ]);
  return <TeamsAdmin initialTeams={teams} matchCounts={matchCounts} />;
}
