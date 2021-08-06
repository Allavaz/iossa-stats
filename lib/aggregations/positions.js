const fullnames = {
  
  d1t1: "Liga D1 T1",
  d1t2: "Liga D1 T2",
  d1t3: "Liga D1 T3",
  d1t4: "Liga D1 T4",
  d1t6: "Liga D1 T6",
  d1t7: "Liga D1 T7",

  d2t2: "Liga D2 T2",
  d2t3: "Liga D2 T3",
  d2t4: "Liga D2 T4",
  d2t6: "Liga D2 T6",
  d2t7: "Liga D2 T7",

  maradeit1a: "Copa Maradei T1 - Grupo A",
  maradeit1b: "Copa Maradei T1 - Grupo B",
  maradeit1c: "Copa Maradei T1 - Grupo C",
  maradeit3a: "Copa Maradei T3 - Grupo A",
  maradeit3b: "Copa Maradei T3 - Grupo B",
  maradeit3c: "Copa Maradei T3 - Grupo C",
  maradeit3d: "Copa Maradei T3 - Grupo D",
  maradeit5a: "Copa Maradei T5 - Grupo A",
  maradeit5b: "Copa Maradei T5 - Grupo B",
  maradeit5c: "Copa Maradei T5 - Grupo C",
  maradeit6a: "Copa Maradei T6 - Grupo A",
  maradeit6b: "Copa Maradei T6 - Grupo B",
  maradeit6c: "Copa Maradei T6 - Grupo C",
  maradeit7a: "Copa Maradei T7 - Grupo A",
  maradeit7b: "Copa Maradei T7 - Grupo B",
  maradeit7c: "Copa Maradei T7 - Grupo C",
  maradeit7d: "Copa Maradei T7 - Grupo D",

  americat3: "Copa America T3",
  america21r: "Copa America '21 - Regular",

  lmt0: "Liga Master T0",
  lmt5: "Liga Master T5",

  ddht0: "Division de Honor T0",
  ddht5: "Division de Honor T5",

  sd1t6: "Superliga D1 T6",
  sd1t7: "Superliga D1 T7",
  

};

module.exports = (arg) => {
  return [
    {
      $match: {
        torneo: fullnames[arg],
      },
    },
    {
      $project: {
        teams: 1,
      },
    },
    {
      $unwind: {
        path: "$teams",
        includeArrayIndex: "<<string>>",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$teams.teamname",
        PJ: {
          $sum: 1,
        },
        teaminfo: {
          $last: "$teams.teaminfo",
        },
        results: {
          $push: "$teams.result",
        },
        scores: {
          $push: "$teams.score",
        },
        conceded: {
          $push: "$teams.scorereceived",
        },
      },
    },
    {
      $addFields: {
        Pts: {
          $add: [
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: "$results",
                      as: "a",
                      cond: {
                        $eq: ["$$a", 1],
                      },
                    },
                  },
                },
                3,
              ],
            },
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: "$results",
                      as: "a",
                      cond: {
                        $eq: ["$$a", 0],
                      },
                    },
                  },
                },
                1,
              ],
            },
          ],
        },
        GF: {
          $sum: "$scores",
        },
        GC: {
          $sum: "$conceded",
        },
        PG: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", 1],
              },
            },
          },
        },
        PE: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", 0],
              },
            },
          },
        },
        PP: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", -1],
              },
            },
          },
        },
        DF: {
          $subtract: [
            {
              $sum: "$scores",
            },
            {
              $sum: "$conceded",
            },
          ],
        },
      },
    },
    {
      $project: {
        results: 0,
        scores: 0,
        conceded: 0,
      },
    },
    {
      $sort: {
        Pts: -1,
        PJ: 1,
        DF: -1,
      },
    },
  ];
};
