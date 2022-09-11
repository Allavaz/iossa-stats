function getRegex(arg) {
  const d1regex = /^d1t([0-9]*)/i;
  const d2regex = /^d2t([0-9]*)/i;
  const d3regex = /^d3t([0-9]*)/i;
  const maradeiregex = /^maradeit([0-9]*)([a-z])/i;
  const americaregex = /^americat([0-9]*)/i;
  const sd1regex = /^sd1t([0-9]*)/i;
  const lmregex = /^lmt([0-9]*)/i;
  const ddhregex = /^ddht([0-9]*)/i;

  if (d1regex.test(arg)) {
    const match = arg.match(d1regex);
    return "Liga D1 T" + match[1];
  } else if (d2regex.test(arg)) {
    const match = arg.match(d2regex);
    return "Liga D2 T" + match[1];
  } else if (d3regex.test(arg)) {
    const match = arg.match(d3regex);
    return "Liga D3 T" + match[1];
  } else if (maradeiregex.test(arg)) {
    const match = arg.match(maradeiregex);
    return `Copa Maradei T${match[1]} - Grupo ${match[2].toUpperCase()}`;
  } else if (sd1regex.test(arg)) {
    const match = arg.match(sd1regex);
    return "Superliga D1 T" + match[1];
  } else if (americaregex.test(arg)) {
    const match = arg.match(americaregex);
    return "Copa America T" + match[1];
  } else if (lmregex.test(arg)) {
    const match = arg.match(lmregex);
    return "Liga Master T" + match[1];
  } else if (ddhregex.test(arg)) {
    const match = arg.match(ddhregex);
    return "Division de Honor T" + match[1];
  } else if (arg === "lzt8a") {
    return "Liga Zero T8 - Grupo A"
  } else if (arg === "lzt8b") {
    return "Liga Zero T8 - Grupo B"
  }
}

module.exports = arg => {
  return [
    {
      $match: {
        torneo: getRegex(arg)
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
};
