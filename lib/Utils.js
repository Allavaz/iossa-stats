import { Duration, Settings } from "luxon";
Settings.defaultLocale = "es";

export function calcPercentages(home, away) {
  let total = home + away;
  let homepercentage = Math.round((home / total) * 100);
  let awaypercentage = Math.round((away / total) * 100);
  return [homepercentage, awaypercentage];
}

export function calcIndivPossession(indiv, home, away) {
  let total = home + away;
  return Math.round((indiv / total) * 100);
}

export function getMonthFromString(mon) {
  var month = new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  if (month < 10) {
    return "0" + month;
  } else {
    return month;
  }
}

function removeZero(item) {
  return Object.keys(item)
    .filter(key => item[key] !== 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: item[key] }), {});
}

export function secondsToStringDuration(seconds) {
  let duration = Duration.fromObject({ seconds })
    .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
    .toObject();
  let cleanDuration = removeZero(duration);
  if (Duration.fromObject(cleanDuration).as("seconds") === 0) {
    cleanDuration.seconds = 0
  }
  return Duration.fromObject(cleanDuration).toHuman({
    unitDisplay: "short"
  });
}
