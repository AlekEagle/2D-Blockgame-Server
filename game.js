var WebSocket = require('ws');
var http = require('https');
var fs = require("fs");
var Player = require("./Player.js").Player;
var GameTypes = require("./Games.js");
var commandHandler = require("./commandhandler.js");
var socketServer,players,onlinePlayers,config,games;
var curLobby,lobbyCount=1;
var gameTypes = require("./gamemodes/").realGames;
function init() {
	games = [];players=[];
	config = {
		serverPort: 2083,
		ssl_key: "./SSL/alekeagle.tk.key",
		ssl_cert: "./SSL/alekeagle.tk.pem",
		maxUserLength: 30,
		maxUsersConnected: 60,
		defaultGameMode: 0,
		desiredTPS: 60,
		beatInterval: 4000,
	};

	var readline = require('readline');
    var in_ = readline.createInterface({ input: process.stdin, output: process.stdout });
    setTimeout(prompt, 100);
	function prompt() {
		in_.question(">", function(str) {
			commandHandler.handle(str);
			return prompt(); // Too lazy to learn async
		});	
	};
	setupSocket();
};

function setupSocket(){
	var processRequest = function( req, res ) {
		console.log(req);
        res.writeHead(200);
		res.end("nope.png");
		//TODO Stats later on
    };
	var srv = http.createServer({key: fs.readFileSync( config.ssl_key ),cert: fs.readFileSync( config.ssl_cert )}, processRequest ).listen( config.serverPort );
	this.socketServer = new WebSocket.Server({server:srv});
    console.log("[Game] Listening on port " + config.serverPort);
	setInterval(loop.bind(this),1000/config.desiredTPS);
	setInterval(beat.bind(this),config.beatInterval);
    this.socketServer.on('error', function err(e) {
        switch (e.code) {
            case "EADDRINUSE": 
                console.log("[Error] Server could not bind to port! ");
                break;
            case "EACCES": 
                console.log("[Error] Please make sure you are running with root privileges.");
                break;
            default:
                console.log("[Error] Unhandled error code: "+e.code);
                break;
        }
        process.exit(1); // Exits the program
    });
	this.socketServer.on('connection', function connection(ws, req) {
		var origin = req.headers.origin;
        if (origin != 'https://priv.alekeagle.tk' && origin != 'https://alekeagle.tk' && origin != 'https://localhost' && origin != 'https://127.0.0.1') {
			console.log(origin);
            ws.close();
            return;
        }
		var PID;
		ws.on('message', function incoming(message) {
			var data = message.split("|");
			var type = parseInt(data[0]);
			switch(type){
				case 0 :
					var startX = Math.round(Math.random()*(config.maxX)),
						startY = Math.round(Math.random()*(config.maxY));
					var name = data[1].substring(0,30).replace(/ /g,"").replace(/<\/?[^>]+(>|$)/g, "");
					this.PID = aTA(players,new Player(0,name,startX,startY,ws));
					players[this.PID].id=this.PID;
					console.log("New Player "+players[this.PID].name+", Assigned to ID "+players[this.PID].id);
					players[this.PID].send("0|"+this.PID+"|"+startX+"|"+startY+"|"+name);
					break;
				case 1 :
					if(players[this.PID])				
					games[players[this.PID].curGame].onKeyDown(this.PID,parseInt(data[1]));
					break;
				case 2 : 
					if(players[this.PID])
					games[players[this.PID].curGame].onKeyUp(this.PID,parseInt(data[1]));
					break;
				case 3 : 
					players[this.PID].enable();
					players[this.PID].joinGame(getLobbyID());
					break;
				case 4 : 
					players[this.PID].width = parseInt(data[1]);
					players[this.PID].height = parseInt(data[2]);
					break;
				case 5 : 
					games[players[this.PID].curGame].onMouseMove(this.PID,parseInt(data[1]),parseInt(data[2]));
					break;
				case 6 :
					games[players[this.PID].curGame].onChatMessage(this.PID,data[1],data[2]);
					break;
				case 7 : 
					//counterbeat
					players[this.PID].counterBeat();
					break;
				default :
					console.log("[Game] Recieved invalid packet from "+this.PID);//Kick them.
					break;
			}
		  });
		ws.on('close', function incoming(code, message) {
			if(players[this.PID]){
				if(games[players[this.PID].curGame])
					games[players[this.PID].curGame].delPlayer(players[this.PID]);
				rFA(players,this.PID);
				console.log(this.PID+" Disconnected "+message+"("+code+")");
			}
		});
		ws.on('error', function incoming(error) {
			if(players[this.PID]){
				if(games[players[this.PID].curGame])
					games[players[this.PID].curGame].delPlayer(players[this.PID]);
				rFA(players,this.PID);
				console.log(this.PID+" Disconnected "+error);
			}
		});
	});
}
var getLobbyID = function(){
	lobbyCount=0;
	for(var i=0;i<games.length;i++){
		if(games[i]&&games[i].GameType==1){
			lobbyCount++;
			if(games[i].playerCount < games[i].playerCap){
				return i;
			}
		}
	}			
	var gID = aTA(games,new GameTypes.ML("Lobby #"+lobbyCount));
	games[gID].gID = gID;
	return gID;
}
var tps=0;
var lastRun;
function loop(){
	if(!lastRun) {lastRun = new Date().getTime();return;}
    var delta = (new Date().getTime() - lastRun)/1000;
    lastRun = new Date().getTime();
    tps = 1/delta;
	for(var i = 0;i<games.length;i++){
		if(games[i]){
			games[i].update();
		}
	}
}
function beat(){
	for(var i=0;i<games.length;i++){
		if(games[i]){
			for(var p=0;p<games[i].players.length;p++){
				if(games[i].players[p])
				games[i].players[p].beat();
			}
		}
	}
}
function gtps(){
	return tps;
}

var aTA = function(arr,obj){
	for(var i=0;i<arr.length;i++){
        if(!arr[i]){
            arr[i]=obj;
            return i;
        }
    }
    return arr.push(obj)-1;
}
var rFA = function(arr,ind){
	arr[ind]=null;
}

init();
exports.getLobbyID = getLobbyID;
exports.aTA = aTA;
exports.rFA = rFA;
exports.tps = gtps;
exports.players = players;
exports.games = games;
exports.gameTypes = gameTypes;
exports.config = config;
