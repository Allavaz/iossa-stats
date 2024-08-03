export default function palmares(teamname?: string) {
  const aggregation: any = [
    {
      $group: {
        _id: "$firstPlace",
        torneos: {
          $push: "$torneo"
        },
        wins: {
          $sum: 1
        }
      }
    }
  ];
  if (teamname) {
    aggregation.unshift({
      $match: { firstPlace: teamname }
    });
  }
  return aggregation;
}
