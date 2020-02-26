function poderOfensivo(data) {
    return Math.round((data.goals*15+data.shotsontarget+data.assists*10)/data.matches);
}

/* function participacionJuego(data) {
    return Math.round((((data.distancecovered/data.matches)*.25)+((data.possession/100)*data.matches))*100/40);
} */

function aporteDefensivo(data) {
    return Math.round((data.interceptions/data.matches)*2.5+(data.tacklescompleted/data.matches));
}

function capacidadCreativa(data) {
    return Math.round((data.passescompleted+data.assists*10+data.possession*10)/data.matches);
}

function findcoeff(data) {
    let numbers = [poderOfensivo(data), aporteDefensivo(data), capacidadCreativa(data)]
    const max = Math.max.apply(Math, numbers);

    return 1/max;
}

/* function avg(data) {
    return Math.round((poderOfensivo(data)+participacionJuego(data)+aporteDefensivo(data)+capacidadCreativa(data))/4)
} */

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