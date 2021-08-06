export function calcPercentages(home, away) {
    let total = home + away;
    let homepercentage = Math.round((home / total) * 100);
    let awaypercentage = Math.round((away / total) * 100);
    return ([homepercentage, awaypercentage]);
}

export function calcIndivPossession(indiv, home, away) {
    let total = home + away;
    return (Math.round((indiv / total) * 100));
}

export function getMonthFromString(mon){
    var month = new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
    if (month<10){
        return "0"+month;
    } else {
        return month;
    }
 }