exports.calcPercentages = function(home, away) {
    let total = home + away;
    let homepercentage = Math.round((home / total) * 100);
    let awaypercentage = Math.round((away / total) * 100);
    return ([homepercentage, awaypercentage]);
}

exports.calcIndivPossession = function(indiv, home, away) {
    let total = home + away;
    return (Math.round((indiv / total) * 100));
}