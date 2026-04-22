[Team]
id
name: str
shortname: str
logo: str

[Player]
id
name: str
steamid: str

[Match]
id
mongoID: str
sourceJSON: json
tournament: str
homeScore: int
awayScore: int
homeTeam: Team
awayTeam: Team
date: date
filename: str
secondsPlayed: int
format: 8 # 8v8

[MatchPlayer]
match: Match
player: Player
side: home | away
goals, assists, passes, etc: int

[MatchEvent]
match: Match
eventType: GOAL | YELLOW CARD | SECOND YELLOW | RED CARD | OWN GOAL
player1: Player
player2: Player
player3: Player
minute: int

[MatchPlayerPosition]
matchPlayer: MatchPlayer
position: GK | RB | LB | etc
secondsPlayed: int
