# [IOSoccer Sudamérica Stats](https://stats.iosoccer-sa.bid)

Web app that tracks matches, standings, individual stats and rankings for the South American IOSoccer Community, made with the **MERN** stack:
- NodeJS
- Express
- React
- MongoDB

## Backend

I'm using Express as a web server that hosts the frontend static files. There's a secret endpoint protected with password that the staff of the community uses to upload JSON files that IOSoccer creates at the end of a match.

Relevant information from those JSON files is extracted and extra information is also added from the team database, such as team logos etc.

The database is running on MongoDB, where all the matches are stored and complex aggregation pipelines are used to calculate the standings of our leagues. Also there's Views that show the individual player statistics in our different seasons and tournaments.

![MongoDB Compass screenshot](https://i.imgur.com/pnpu2Um.png)

Finally, the backend serves as a REST API retrieving information from the database using the [MongoDB Node.js Native Driver](https://mongodb.github.io/node-mongodb-native/) and returning it as a JSON that will be used by the frontend.

## Frontend

Made with [Create React App](https://github.com/facebook/create-react-app), the frontend displays information gathered from the REST API I mentioned earlier.

### Home

Shows the last 20 matches played and has a right sidebar with the standings of our ongoing leagues and group stages.

![Homepage](https://i.imgur.com/UD1Z91z.png)

### Individual stats

Uses [ReactTable](https://github.com/tannerlinsley/react-table) with [Fixed Columns](https://github.com/GuillaumeJasmin/react-table-hoc-fixed-columns) and shows statistics such as matches, goals, assists, shots, passes, possession, saves, etc.

The table has a search box and can be sorted. There's also a season and tournament filter for easier navigation.

![Individual Stats](https://i.imgur.com/vVcca21.png)

### Match page

Shows match events such as goals, yellow cards, etc, team statistics and standings for the league that match was played on. It also shows individual statistics and a YouTube video of the match, taken from the Twitch VOD.

On playoff matches it shows the Challonge brackets instead of the standings.

![Match Page](https://i.imgur.com/v53gBLH.png)