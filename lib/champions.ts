import prisma from "./prisma";

export async function updateChampion(tournament: string, teamname: string) {
  return prisma.tournament.update({
    where: { torneo: tournament },
    data: { winners: { firstPlace: teamname } },
  });
}

export async function deleteChampion(tournament: string) {
  return prisma.tournament.update({
    where: { torneo: tournament },
    data: { winners: null },
  });
}
