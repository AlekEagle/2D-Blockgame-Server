module.exports={
	ML: require("./MainLobby.js"),//1
	JGL: require("./JoinGameList.js"),//3
	JGID: require("./JoinGameId.js"),//4
	CGM: require("./CreateGameMenu.js"),//2
	CGL: require("./CreateGameLobby.js"),//5
	Snake: require("./mgSnake.js"),//12
	PingPong: require("./mgPingPong.js"),//13
	Race: require("./mgRace.js"),//14
	LandWars: require("./mgLandWars.js"),//10
	Drawing: require("./mgDrawing.js"),//11
	FMaze: require("./mgFMaze.js"),//15
	Maze: require("./mgMaze.js"),//16
	adminRoom: require("./adminRoom.js")//6
}
module.exports.realGames = [
	{"name":"PingPong","obj": require("./mgPingPong.js"),"enabled":true,"minPlayers":1,"maxPlayers":2},
	//{"name":"Drawing","obj": require("./mgDrawing.js"),"enabled":false,"minPlayers":1,"maxPlayers":12,"canJDuring":false},
	//{"name":"Snake","obj": require("./mgSnake.js"),"enabled":false,"minPlayers":1,"maxPlayers":8,"canJDuring":false},
	//{"name":"LandWars","obj": require("./mgLandWars.js"),"enabled":false,"minPlayers":4,"maxPlayers":12,"canJDuring":false},
	{"name":"Racing","obj": require("./mgRace.js"),"enabled":true,"minPlayers":2,"maxPlayers":50},
	{"name":"Factoring Maze","obj": require("./mgFMaze.js"),"enabled":true,"minPlayers":1,"maxPlayers":500},
	{"name":"Maze","obj": require("./mgMaze.js"),"enabled":true,"minPlayers":1,"maxPlayers":500}
	
]