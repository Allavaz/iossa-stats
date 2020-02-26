const axios = require('axios');
const steamapi = require('./steamapi');
const SteamID = require('steamid');

exports.getSteamInfo = async function(id, res) {
    let sid = new SteamID(id);
    let sid64 = sid.getSteamID64();
    let info = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamapi.steamapi}&steamids=${sid64}`);
    res.json(info.data.response.players[0]);
}