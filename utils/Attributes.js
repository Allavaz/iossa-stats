function poderOfensivo(data) {
  return Math.round((data.goals*15+data.shotsontarget+data.assists*10)/(data.secondsplayed/60/90));
}

function aporteDefensivo(data) {
  return Math.round((data.interceptions/data.matches)*2.5+(data.tacklescompleted/(data.secondsplayed/60/90)));
}

function capacidadCreativa(data) {
  return Math.round((data.passescompleted+data.assists*10+data.possession*10)/(data.secondsplayed/60/90));
}

function findcoeff(data) {
  let numbers = [poderOfensivo(data), aporteDefensivo(data), capacidadCreativa(data)]
  const max = Math.max.apply(Math, numbers);

  return 1/max;
}

export default function Attributes(props) {
  let coeff = findcoeff(props);
  return ({
    "nombre": props.name,
    "partidos": props.matches,
    "PF": poderOfensivo(props), 
    //"PJ": participacionJuego(jsons[i]), 
    "AD": aporteDefensivo(props), 
    "CC": capacidadCreativa(props),
    "coeff": coeff
    //"valoracion": avg(jsons[i])
  })   
}