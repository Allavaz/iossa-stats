export default function positions(arg: any) {
  return [
    {
      $match: arg
    },
    {
      $sort: {
        fecha: -1
      }
    },
    {
      $project: {
        teams: 1
      }
    },
    {
      $unwind: {
        path: "$teams",
        includeArrayIndex: "<<string>>",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $group: {
        _id: "$teams.teamname",
        PJ: {
          $sum: 1
        },
        teaminfo: {
          $last: "$teams.teaminfo"
        },
        results: {
          $push: "$teams.result"
        },
        scores: {
          $push: "$teams.score"
        },
        conceded: {
          $push: "$teams.scorereceived"
        }
      }
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
                        $eq: ["$$a", 1]
                      }
                    }
                  }
                },
                3
              ]
            },
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: "$results",
                      as: "a",
                      cond: {
                        $eq: ["$$a", 0]
                      }
                    }
                  }
                },
                1
              ]
            }
          ]
        },
        GF: {
          $sum: "$scores"
        },
        GC: {
          $sum: "$conceded"
        },
        PG: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", 1]
              }
            }
          }
        },
        PE: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", 0]
              }
            }
          }
        },
        PP: {
          $size: {
            $filter: {
              input: "$results",
              as: "a",
              cond: {
                $eq: ["$$a", -1]
              }
            }
          }
        },
        DF: {
          $subtract: [
            {
              $sum: "$scores"
            },
            {
              $sum: "$conceded"
            }
          ]
        },
        last5: {
          $slice: ["$results", 5]
        }
      }
    },
    {
      $project: {
        results: 0,
        scores: 0,
        conceded: 0
      }
    },
    {
      $sort: {
        Pts: -1,
        PJ: 1,
        DF: -1
      }
    }
  ];
}
