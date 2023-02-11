function getRegex(arg) {
  const tempregex = /^t([0-9]+)/i;
  const d1regex = /^d1t([0-9]+)/i;
  const d2regex = /^d2t([0-9]+)/i;
  const d3regex = /^d3t([0-9]+)/i;
  const cd1regex = /^cd1t([0-9]+)/i;
  const cd2regex = /^cd2t([0-9]+)/i;
  const cd3regex = /^cd3t([0-9]+)/i;
  const sd1regex = /^sd1t([0-9]+)/i;
  const lzregex = /^lzt([0-9]+)/i;
  const cgregex = /^cgt([0-9]+)/i;
  const masterregex = /^mastert([0-9]+)/i;
  const recopamasterregex = /^recopamastert([0-9]+)/i;
  const supercopamasterregex = /^supercopamastert([0-9]+)/i;
  const cvregex = /^cvt([0-9]+)/i;
  const maradeiregex = /^maradeit([0-9]+)/i;
  const recopamaradeiregex = /^recopamaradeit([0-9]+)/i;
  const lmregex = /^lmt([0-9]+)/i;
  const ddhregex = /^ddht([0-9]+)/i;
  const americaregex = /^americat([0-9]+)/i;
  const copadelsurregex = /^copadelsurt([0-9]+)/i;
  const izororegex = /^izorot([0-9]+)/i;
  const izplataregex = /^izplatat([0-9]+)/i;

  if (tempregex.test(arg)) {
    const match = arg.match(tempregex);
    return { $regex: "T" + match[1] };
  } else if (arg === "selecciones") {
    return { $regex: "Copa (del Sur|America)" };
  } else if (arg === "sd1") {
    return { $regex: "Superliga D1" };
  } else if (arg === "lz") {
    return { $regex: "Liga Zero" };
  } else if (arg === "d1") {
    return { $regex: "(Liga D1|Promoción D1/D2)" };
  } else if (arg === "d2") {
    return { $regex: "(Liga D2|Promoción D1/D2|Promoción D2/D3)" };
  } else if (arg === "d3") {
    return { $regex: "(Liga D3|Promoción D2/D3)" };
  } else if (arg === "master") {
    return { $regex: "Copa Master" };
  } else if (arg === "cv") {
    return { $regex: "Copa valencARc" };
  } else if (arg === "lm") {
    return { $regex: "Liga Master" };
  } else if (arg === "ddh") {
    return { $regex: "Division de Honor" };
  } else if (arg === "supercopamaster") {
    return { $regex: "Supercopa Master" };
  } else if (arg === "recopamaster") {
    return { $regex: "Recopa Master" };
  } else if (arg === "recopamaradei") {
    return { $regex: "Recopa Maradei" };
  } else if (arg === "america") {
    return { $regex: "Copa America" };
  } else if (arg === "copadelsur") {
    return { $regex: "Copa del Sur" };
  } else if (arg === "cd1") {
    return { $regex: "Copa D1" };
  } else if (arg === "cd2") {
    return { $regex: "Copa D2" };
  } else if (arg === "cd3") {
    return { $regex: "Copa D3" };
  } else if (arg === "maradei") {
    return { $regex: "Copa Maradei" };
  } else if (arg === "cg") {
    return { $regex: "Copa Gubero" };
  } else if (cd1regex.test(arg)) {
    const match = arg.match(cd1regex);
    return { $regex: "Copa D1 T" + match[1] };
  } else if (cd2regex.test(arg)) {
    const match = arg.match(cd2regex);
    return { $regex: "Copa D2 T" + match[1] };
  } else if (cd3regex.test(arg)) {
    const match = arg.match(cd3regex);
    return { $regex: "Copa D3 T" + match[1] };
  } else if (d1regex.test(arg)) {
    const match = arg.match(d1regex);
    return { $regex: "(Liga D1|Promoción D1/D2) T" + match[1] };
  } else if (d2regex.test(arg)) {
    const match = arg.match(d2regex);
    return { $regex: "(Liga D2|Promoción D1/D2|Promoción D2/D3) T" + match[1] };
  } else if (d3regex.test(arg)) {
    const match = arg.match(d3regex);
    return { $regex: "(Liga D3|Promoción D2/D3) T" + match[1] };
  } else if (sd1regex.test(arg)) {
    const match = arg.match(sd1regex);
    return { $regex: "Superliga D1 T" + match[1] };
  } else if (lzregex.test(arg)) {
    const match = arg.match(lzregex);
    return { $regex: "Liga Zero T" + match[1] };
  } else if (cgregex.test(arg)) {
    const match = arg.match(cgregex);
    return { $regex: "Copa Gubero T" + match[1] };
  } else if (masterregex.test(arg)) {
    const match = arg.match(masterregex);
    return { $regex: "Copa Master T" + match[1] };
  } else if (cvregex.test(arg)) {
    const match = arg.match(cvregex);
    return { $regex: "Copa valencARc T" + match[1] };
  } else if (recopamasterregex.test(arg)) {
    const match = arg.match(recopamasterregex);
    return { $regex: "Recopa Master T" + match[1] };
  } else if (supercopamasterregex.test(arg)) {
    const match = arg.match(recopamasterregex);
    return { $regex: "Recopa Master T" + match[1] };
  } else if (maradeiregex.test(arg)) {
    const match = arg.match(maradeiregex);
    return { $regex: "Copa Maradei T" + match[1] };
  } else if (recopamaradeiregex.test(arg)) {
    const match = arg.match(recopamaradeiregex);
    return { $regex: "Recopa Maradei T" + match[1] };
  } else if (lmregex.test(arg)) {
    const match = arg.match(lmregex);
    return { $regex: "Liga Master T" + match[1] };
  } else if (ddhregex.test(arg)) {
    const match = arg.match(ddhregex);
    return { $regex: "Division de Honor T" + match[1] };
  } else if (arg === "america21") {
    return { $regex: "Copa America '21" };
  } else if (arg === "america21r") {
    return "Copa America '21 - Regular";
  } else if (arg === "america21p") {
    return "Copa America '21 - Playoff";
  } else if (americaregex.test(arg)) {
    const match = arg.match(americaregex);
    return { $regex: "Copa America T" + match[1] };
  } else if (copadelsurregex.test(arg)) {
    const match = arg.match(copadelsurregex);
    return { $regex: "Copa del Sur T" + match[1] };
  } else if (izororegex.test(arg)) {
    const match = arg.match(izororegex);
    return { $regex: "Copa Intrazonal de Oro T" + match[1] };
  } else if (izplataregex.test(arg)) {
    const match = arg.match(izplataregex);
    return { $regex: "Copa Intrazonal de Plata T" + match[1] };
  } else if (arg === "izoro") {
    return { $regex: "Copa Intrazonal de Oro" };
  } else if (arg === "izplata") {
    return { $regex: "Copa Intrazonal de Plata" };
  }
}

module.exports = arg => {
  if (arg === "all") {
    return {};
  } else {
    return { torneo: getRegex(arg) };
  }
};
