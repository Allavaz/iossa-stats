import { MongoClient, ObjectId } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });
import { fecha, getTeamLogo } from '../utils/Utils';
import { readFileSync } from 'fs';
import path from 'path';
const publicPath = path.resolve('./public');

function getGoalEvents(data, side) {
  let players = []
  for (let i in data) {
    if (data[i].event === 'GOAL' && data[i].team === side) {
      if ((players.findIndex(e => e.steamid === data[i].player1SteamId)) === -1) {
        players.push({
          name: data[i].name,
          steamid: data[i].player1SteamId,
          event: 'GOAL',
          seconds: [data[i].second]
        });
      } else {
        players[players.findIndex(e => e.steamid === data[i].player1SteamId)].seconds.push(data[i].second);
      }
    } else if (data[i].event === 'OWN GOAL' && data[i].team !== side) {
      if ((players.findIndex(e => e.steamid === data[i].player1SteamId)) === -1) {
        players.push({
          name: data[i].name,
          steamid: data[i].player1SteamId,
          event: 'OWN GOAL',
          seconds: [data[i].second]
        });
      } else {
        players[players.findIndex(e => e.steamid === data[i].player1SteamId)].seconds.push(data[i].second);
      }
    }
  }
  let pelotaString = `<img height="16px" src='data:image/png;base64,${readFileSync(path.join(publicPath, 'matchicons', 'pelota.png')).toString('base64')}'>`;
  let ownGoalString = `<img height="16px" src='data:image/png;base64,${readFileSync(path.join(publicPath, 'matchicons', 'gc.png')).toString('base64')}'>`;
  let string = '';
  for (let i in players) {
    let secondsString = '';
    for (let j in players[i].seconds) {
      if (parseInt(j) === (players[i].seconds.length - 1)) {
        secondsString += `${Math.round(players[i].seconds[j]/60)}'`  
      } else {
        secondsString += `${Math.round(players[i].seconds[j]/60)}', `
      }
    }
    string += `
    <li>
      <div class="event">
        ${players[i].event === 'GOAL' ? pelotaString : ownGoalString}
        <span>${players[i].name} (${secondsString})</span>
      </div>
    </li>
    `
  }
  return string;
}

export default async function MatchCardTemplate(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const o_id = new ObjectId(id);
    let data = await db.collection(process.env.DB_COLLECTION)
      .findOne({_id: o_id});
    const homeGoals = getGoalEvents(data.matchevents, 'home');
    const awayGoals = getGoalEvents(data.matchevents, 'away');
    let template =
      `
      <body>
      <div class="container">
        <div class='torneo'>
          ${data.torneo}
        </div>
        <table class="resulttable">
          <tbody>
            <tr>
              <td><h2>${data.teams[0].teamname}</h2></td>
              <td><span class="fecha">${fecha(data.fecha.toISOString())}</span></td>
              <td><h2>${data.teams[1].teamname}</h2></td>
            </tr>
            <tr>
              <td><img height="128px" src='data:image/png;base64,${readFileSync(path.join(publicPath, getTeamLogo(data.teams[0].teamname))).toString('base64')}'></td>
              <td><h1>${data.teams[0].score} - ${data.teams[1].score}</h1></td>
              <td><img height="128px" src='data:image/png;base64,${readFileSync(path.join(publicPath, getTeamLogo(data.teams[1].teamname))).toString('base64')}'></td>
            </tr>
            <tr class="eventtr">
              <td>
                <ul class="eventlist">
                  ${homeGoals}
                </ul>
              </td>
              <td>
              </td>
              <td>
                <ul class="eventlist">
                  ${awayGoals}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </body>
      `;
      return template;
  } catch(e) {
    throw e;
  } finally {
    await client.close();
  }
}