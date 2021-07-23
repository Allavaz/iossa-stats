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
      { torneo: "Liga D1 T2" },
      { torneo: "Liga D1 T2 (Desempate)" },
      { torneo: "Liga D2 T2" },
      { torneo: "Copa Master T2" },
      { torneo: "Recopa Master T2" },
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
      { torneo: "Liga D2 T6 (Desempate 1er Puesto)" },
      { torneo: "Liga D1 T6" },
      { torneo: "Copa Maradei T6 - Eliminatorias" },
      { torneo: "Copa Maradei T6 - Grupo A" },
      { torneo: "Copa Maradei T6 - Grupo A (Desempate)" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
      { torneo: "Copa Master T6" },
      { torneo: "Copa valencARc T6" },
    ],
  },
  t7: {
    $or: [
      { torneo: "Superliga D1 T7" },
      { torneo: "Liga D2 T7" },
      { torneo: "Liga D1 T7" },
      { torneo: "Copa Maradei T7 - Eliminatorias" },
      { torneo: "Copa Maradei T7 - Grupo A" },
      { torneo: "Copa Maradei T7 - Grupo A (Desempate 2do Puesto)" },
      { torneo: "Copa Maradei T7 - Grupo B" },
      { torneo: "Copa Maradei T7 - Grupo C" },
      { torneo: "Copa Maradei T7 - Grupo D" },
      { torneo: "Copa Maradei T7 - Grupo D (Desempate 1er Puesto)" },
      { torneo: "Copa valencARc T7" },
    ],
  },
  selecciones: {
    $or: [
      { torneo: "Copa America T3" },
      { torneo: "Copa del Sur T3" },
      { torneo: "Copa America '21 - Regular" },
      { torneo: "Copa America '21 - Playoff" },
    ],
  },
  sd1: {
    $or: [
      { torneo: "Superliga D1 T6" },
      { torneo: "Superliga D1 T7" }
    ],
  },
  d1: {
    $or: [
      { torneo: "Liga D1 T1" },
      { torneo: "Liga D1 T2" },
      { torneo: "Liga D1 T2 (Desempate)" },
      { torneo: "Liga D1 T3" },
      { torneo: "Liga D1 T3 - Promoción (Ida)" },
      { torneo: "Liga D1 T3 - Promoción (Vuelta)" },
      { torneo: "Liga D1 T4" },
      { torneo: "Liga D1 T4 - (Desempate)" },
      { torneo: "Liga D1 T4 - Promoción" },
      { torneo: "Liga D1 T6" },
      { torneo: "Liga D1 T7" },
    ],
  },
  d2: {
    $or: [
      { torneo: "Liga D2 T2" },
      { torneo: "Liga D2 T3" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Ida)" },
      { torneo: "Liga D2 T3 - Desempate 3er Puesto (Vuelta)" },
      { torneo: "Liga D2 T4" },
      { torneo: "Liga D2 T6" },
      { torneo: "Liga D2 T6 (Desempate 1er Puesto)" },
      { torneo: "Liga D2 T7" },
    ],
  },
  master: {
    $or: [
      { torneo: "Copa Master T2" },
      { torneo: "Copa Master T3" },
      { torneo: "Copa Master T5" },
      { torneo: "Copa Master T6" },
    ],
  },
  cv: {
    $or: [
      { torneo: "Copa valencARc T6" },
      { torneo: "Copa valencARc T7" },
    ],
  },
  lm: {
    $or: [
      { torneo: "Liga Master T0" }, 
      { torneo: "Liga Master T5" }
    ],
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
    ],
  },
  recopamaster: {
    $or: [
      { torneo: "Recopa Master T2" },
      { torneo: "Recopa Master T3" },
      { torneo: "Recopa Master T0" },
      { torneo: "Recopa Master T5" },
    ],
  },
  recopamaradei: {
    $or: [
      { torneo: "Recopa Maradei T5" },
      { torneo: "Recopa Maradei T5 (Repechaje)" },
    ],
  },
  america: {
    $or: [
      { torneo: "Copa America T3" },
      { torneo: "Copa America '21 - Regular" },
      { torneo: "Copa America '21 - Playoff" },
    ],
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
      { torneo: "Copa Maradei T6 - Grupo A (Desempate)" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
      { torneo: "Copa Maradei T7 - Eliminatorias" },
      { torneo: "Copa Maradei T7 - Grupo A" },
      { torneo: "Copa Maradei T7 - Grupo A (Desempate 2do Puesto)" },
      { torneo: "Copa Maradei T7 - Grupo B" },
      { torneo: "Copa Maradei T7 - Grupo C" },
      { torneo: "Copa Maradei T7 - Grupo D" },
      { torneo: "Copa Maradei T7 - Grupo D (Desempate 1er Puesto)" },
    ],
  },
  cg: {
    $or: [{ torneo: "Copa Gubero T4" }],
  },
  d1t2: {
    $or: [
      { torneo: "Liga D1 T2" },
      { torneo: "Liga D1 T2 (Desempate)" },
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
  sd1t7: {
    $or: [{ torneo: "Superliga D1 T7" }],
  },
  d1t6: {
    $or: [{ torneo: "Liga D1 T6" }],
  },
  d1t7: {
    $or: [{ torneo: "Liga D1 T7" }],
  },
  d2t6: {
    $or: [
      { torneo: "Liga D2 T6" },
      { torneo: "Liga D2 T6 (Desempate 1er Puesto)" }
    ],
  },
  d2t7: {
    $or: [{ torneo: "Liga D2 T7" }],
  },
  d2t4: {
    $or: [{ torneo: "Liga D2 T4" }],
  },
  cgt4: {
    $or: [{ torneo: "Copa Gubero T4" }],
  },
  d2t2: {
    torneo: "Liga D2 T2",
  },
  mastert2: {
    torneo: "Copa Master T2",
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
  cvt6: {
    torneo: "Copa valencARc T6",
  },
  cvt7: {
    torneo: "Copa valencARc T7",
  },
  recopamastert0: {
    torneo: "Recopa Master T0",
  },
  recopamastert2: {
    torneo: "Recopa Master T2",
  },
  recopamastert3: {
    torneo: "Recopa Master T3",
  },
  recopamastert5: {
    torneo: "Recopa Master T5",
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
      { torneo: "Copa Maradei T6 - Grupo A (Desempate)" },
      { torneo: "Copa Maradei T6 - Grupo B" },
      { torneo: "Copa Maradei T6 - Grupo C" },
    ],
  },
  maradeit7: {
    $or: [
      { torneo: "Copa Maradei T7 - Eliminatorias" },
      { torneo: "Copa Maradei T7 - Grupo A" },
      { torneo: "Copa Maradei T7 - Grupo A (Desempate 2do Puesto)" },
      { torneo: "Copa Maradei T7 - Grupo B" },
      { torneo: "Copa Maradei T7 - Grupo C" },
      { torneo: "Copa Maradei T7 - Grupo D" },
      { torneo: "Copa Maradei T7 - Grupo D (Desempate 1er Puesto)" },
    ],
  },
  recopamaradeit5: {
    $or: [
      { torneo: "Recopa Maradei T5" },
      { torneo: "Recopa Maradei T5 (Repechaje)" },
    ],
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
  americat3: {
    $or: [{ torneo: "Copa America T3" }],
  },
  america21r: {
    $or: [{ torneo: "Copa America '21 - Regular" }],
  },
  america21p: {
    $or: [{ torneo: "Copa America '21 - Playoff" }],
  },
  america21: {
    $or: [
      { torneo: "Copa America '21 - Regular" },
      { torneo: "Copa America '21 - Playoff" },
    ],
  },
  copadelsurt3: {
    $or: [{ torneo: "Copa del Sur T3" }],
  },
};
