module.exports = {
  all: {},
  t0: {
    $or: [
      { torneo: "Liga Master T0" },
      { torneo: "Division de Honor T0" },
      { torneo: "Recopa Master T0" },
    ],
  },
  t1: {
    $or: [
      { torneo: "Liga D1 T1" },
      { torneo: "Copa Maradei T1 - Eliminatorias" },
      { torneo: "Copa Maradei T1 - Grupo A" },
      { torneo: "Copa Maradei T1 - Grupo B" },
      { torneo: "Copa Maradei T1 - Grupo C" },
    ],
  },
  t2: {
    $or: [
      { torneo: "Liga D1 - Temporada 2" },
      { torneo: "Liga D1 - Temporada 2 (Desempate)" },
      { torneo: "Liga D2 - Temporada 1" },
      { torneo: "Copa Master 2019" },
      { torneo: "Recopa Master 2019" },
    ],
  },
  t3: {
    $or: [
      { torneo: "Liga D1 T3" },
      { torneo: "Liga D2 T3" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Ida)" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Vuelta)" },
      { torneo: "Copa Master T3" },
      { torneo: "Copa Maradei T3 - Grupo A" },
      { torneo: "Copa Maradei T3 - Grupo B" },
      { torneo: "Copa Maradei T3 - Grupo C" },
      { torneo: "Copa Maradei T3 - Grupo D" },
      { torneo: "Copa Maradei T3 - Eliminatorias" },
      { torneo: "Supercopa Master T3" },
      { torneo: "Supercopa Master T3 (Repechaje)" },
      { torneo: "Liga D1 T3 - Promoción (Ida)" },
      { torneo: "Liga D1 T3 - Promoción (Vuelta)" },
      { torneo: "Recopa Master T3" },
      { torneo: "Copa America T3" },
      { torneo: "Copa del Sur T3" },
    ],
  },
  t4: {
    $or: [
      { torneo: "Liga D1 T4" },
      { torneo: "Liga D2 T4" },
      { torneo: "Copa Gubero T4" },
      { torneo: "Liga D1 T4 - (Desempate)" },
      { torneo: "Liga D1 T4 - Promoción" },
    ],
  },
  t5: {
    $or: [
      { torneo: "Liga Master T5" },
      { torneo: "Division de Honor T5" },
      { torneo: "Copa Maradei T5 - Eliminatorias" },
      { torneo: "Copa Maradei T5 - Grupo A" },
      { torneo: "Copa Maradei T5 - Grupo B" },
      { torneo: "Copa Maradei T5 - Grupo C" },
      { torneo: "Copa Master T5" },
      { torneo: "Recopa Master T5" },
      { torneo: "Recopa Maradei T5" },
      { torneo: "Recopa Maradei T5 (Repechaje)" },
      { torneo: "Supercopa Master T5" },
    ],
  },
  t6: {
    $or: [
      { torneo: "Superliga D1 T6" },
      { torneo: "Liga D2 T6" },
      { torneo: "Liga D1 T6" },
      { torneo: "Copa Maradei T6 - Eliminatorias" },
      { torneo: "Copa Maradei T6 - Grupo A" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
      { torneo: "Copa Master T6" },
      { torneo: "Recopa Master T6" },
      { torneo: "Recopa Maradei T6" },
      { torneo: "Supercopa Master T6" },
    ],
  },
  sd1: {
    $or: [{ torneo: "Superliga D1 T6" }],
  },
  d1: {
    $or: [
      { torneo: "Liga D1 T1" },
      { torneo: "Liga D1 - Temporada 2" },
      { torneo: "Liga D1 - Temporada 2 (Desempate)" },
      { torneo: "Liga D1 T3" },
      { torneo: "Liga D1 T3 - Promoción (Ida)" },
      { torneo: "Liga D1 T3 - Promoción (Vuelta)" },
      { torneo: "Liga D1 T4" },
      { torneo: "Liga D1 T4 - (Desempate)" },
      { torneo: "Liga D1 T4 - Promoción" },
      { torneo: "Liga D1 T6" },
    ],
  },
  d2: {
    $or: [
      { torneo: "Liga D2 - Temporada 1" },
      { torneo: "Liga D2 T3" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Ida)" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Vuelta)" },
      { torneo: "Liga D2 T4" },
      { torneo: "Liga D2 T6" },
    ],
  },
  master: {
    $or: [
      { torneo: "Copa Master 2019" },
      { torneo: "Copa Master T3" },
      { torneo: "Copa Master T5" },
      { torneo: "Copa Master T6" },
    ],
  },
  lm: {
    $or: [{ torneo: "Liga Master T0" }, { torneo: "Liga Master T5" }],
  },
  ddh: {
    $or: [
      { torneo: "Division de Honor T0" },
      { torneo: "Division de Honor T5" },
    ],
  },
  supercopamaster: {
    $or: [
      { torneo: "Supercopa Master T3" },
      { torneo: "Supercopa Master T3 (Repechaje)" },
      { torneo: "Supercopa Master T5" },
      { torneo: "Supercopa Master T6" },
    ],
  },
  recopamaster: {
    $or: [
      { torneo: "Recopa Master 2019" },
      { torneo: "Recopa Master T3" },
      { torneo: "Recopa Master T0" },
      { torneo: "Recopa Master T5" },
      { torneo: "Recopa Master T6" },
    ],
  },
  recopamaradei: {
    $or: [
      { torneo: "Recopa Maradei T5" },
      { torneo: "Recopa Maradei T5 (Repechaje)" },
      { torneo: "Recopa Maradei T6" },
    ],
  },
  copaamerica: {
    $or: [{ torneo: "Copa America T3" }],
  },
  copadelsur: {
    $or: [{ torneo: "Copa del Sur T3" }],
  },
  maradei: {
    $or: [
      { torneo: "Copa Maradei T3 - Grupo A" },
      { torneo: "Copa Maradei T3 - Grupo B" },
      { torneo: "Copa Maradei T3 - Grupo C" },
      { torneo: "Copa Maradei T3 - Grupo D" },
      { torneo: "Copa Maradei T3 - Eliminatorias" },
      { torneo: "Copa Maradei T1 - Eliminatorias" },
      { torneo: "Copa Maradei T1 - Grupo A" },
      { torneo: "Copa Maradei T1 - Grupo B" },
      { torneo: "Copa Maradei T1 - Grupo C" },
      { torneo: "Copa Maradei T5 - Eliminatorias" },
      { torneo: "Copa Maradei T5 - Grupo A" },
      { torneo: "Copa Maradei T5 - Grupo B" },
      { torneo: "Copa Maradei T5 - Grupo C" },
      { torneo: "Copa Maradei T6 - Eliminatorias" },
      { torneo: "Copa Maradei T6 - Grupo A" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
    ],
  },
  cg: {
    $or: [{ torneo: "Copa Gubero T4" }],
  },
  d1t2: {
    $or: [
      { torneo: "Liga D1 - Temporada 2" },
      { torneo: "Liga D1 - Temporada 2 (Desempate)" },
    ],
  },
  d1t1: {
    $or: [{ torneo: "Liga D1 T1" }],
  },
  d1t4: {
    $or: [
      { torneo: "Liga D1 T4" },
      { torneo: "Liga D1 T4 - (Desempate)" },
      { torneo: "Liga D1 T4 - Promoción" },
    ],
  },
  sd1t6: {
    $or: [{ torneo: "Superliga D1 T6" }],
  },
  d1t6: {
    $or: [{ torneo: "Liga D1 T6" }],
  },
  d2t6: {
    $or: [{ torneo: "Liga D2 T6" }],
  },
  d2t4: {
    $or: [{ torneo: "Liga D2 T4" }],
  },
  cgt4: {
    $or: [{ torneo: "Copa Gubero T4" }],
  },
  d2t1: {
    torneo: "Liga D2 - Temporada 1",
  },
  master2019: {
    torneo: "Copa Master 2019",
  },
  mastert3: {
    torneo: "Copa Master T3",
  },
  mastert5: {
    torneo: "Copa Master T5",
  },
  mastert6: {
    torneo: "Copa Master T6",
  },
  recopamastert0: {
    torneo: "Recopa Master T0",
  },
  recopamaster2019: {
    torneo: "Recopa Master 2019",
  },
  recopamastert3: {
    torneo: "Recopa Master T3",
  },
  recopamastert5: {
    torneo: "Recopa Master T5",
  },
  recopamastert6: {
    torneo: "Recopa Master T6",
  },
  d1t3: {
    $or: [
      { torneo: "Liga D1 T3" },
      { torneo: "Liga D1 T3 - Promoción (Ida)" },
      { torneo: "Liga D1 T3 - Promoción (Vuelta)" },
    ],
  },
  d2t3: {
    $or: [
      { torneo: "Liga D2 T3" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Ida)" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Vuelta)" },
    ],
  },
  supercopamastert3: {
    $or: [
      { torneo: "Supercopa Master T3" },
      { torneo: "Supercopa Master T3 (Repechaje)" },
    ],
  },
  supercopamastert6: {
    $or: [{ torneo: "Supercopa Master T6" }],
  },
  maradeit1: {
    $or: [
      { torneo: "Copa Maradei T1 - Eliminatorias" },
      { torneo: "Copa Maradei T1 - Grupo A" },
      { torneo: "Copa Maradei T1 - Grupo B" },
      { torneo: "Copa Maradei T1 - Grupo C" },
    ],
  },
  maradeit3: {
    $or: [
      { torneo: "Copa Maradei T3 - Grupo A" },
      { torneo: "Copa Maradei T3 - Grupo B" },
      { torneo: "Copa Maradei T3 - Grupo C" },
      { torneo: "Copa Maradei T3 - Grupo D" },
      { torneo: "Copa Maradei T3 - Eliminatorias" },
    ],
  },
  maradeit5: {
    $or: [
      { torneo: "Copa Maradei T5 - Eliminatorias" },
      { torneo: "Copa Maradei T5 - Grupo A" },
      { torneo: "Copa Maradei T5 - Grupo B" },
      { torneo: "Copa Maradei T5 - Grupo C" },
    ],
  },
  maradeit6: {
    $or: [
      { torneo: "Copa Maradei T6 - Eliminatorias" },
      { torneo: "Copa Maradei T6 - Grupo A" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
    ],
  },
  recopamaradeit5: {
    $or: [
      { torneo: "Recopa Maradei T5" },
      { torneo: "Recopa Maradei T5 (Repechaje)" },
    ],
  },
  recopamaradeit6: {
    $or: [{ torneo: "Recopa Maradei T6" }],
  },
  lmt0: {
    $or: [{ torneo: "Liga Master T0" }],
  },
  lmt5: {
    $or: [{ torneo: "Liga Master T5" }],
  },
  ddht0: {
    $or: [{ torneo: "Division de Honor T0" }],
  },
  ddht5: {
    $or: [{ torneo: "Division de Honor T5" }],
  },
  copaamericat3: {
    $or: [{ torneo: "Copa America T3" }],
  },
  copadelsurt3: {
    $or: [{ torneo: "Copa del Sur T3" }],
  },
};
