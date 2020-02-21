const axios = require('axios');
const steamapi = require('./steamapi');

exports.getSteamInfo = async function(id64, res) {
    let info = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamapi.steamapi}&steamids=${id64}`);
    res.json(info.data.response.players[0]);
}