var WebSocket = require('ws');
var gs = require('./game.js');
var LZString = require("lz-string");

var randColor = function(){
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

var neons = ["3dff33","f433ff","33fff5","fff533","ff333d"];

var randNeonColor = function(){
	return "#"+neons[Math.floor(Math.random() * neons.length)];
}

var Player = function(id,_name,startX, startY, _ws) {
    var x = startX,
        y = startY,
        id = id,
		name = _name,
		ws = _ws,
		width,
		height,
		curGame,
		moveSpeed=4,
		color=randNeonColor(),
		ping=0,
		missedBeats=0,
		tflb=0,
		beating=false;//ticks from last beat
	var up=false,
		down=false,
		left=false,
		right=false,
		enabled=false;
		
	var getPing = function(){
		return this.ping;
	}

	var beat = function(){
		this.send("4|");
		if(this.beating)this.missedBeats++;else this.missedBeats=0;
		this.tflb=new Date().getTime();
		this.beating=true;
		if(this.missedBeats>=10){
			this.send('5|Kicked for too much lag.')
			this.ws.close();
			console.log(this.id+" Kicked for Missed Heartbeat ");
		}
	}
	
	var counterBeat = function(){
		this.ping=new Date().getTime()-this.tflb;
		this.beating=false;
		this.missedBeats=0;
	}
		
	var onKeyDown = function(keynum){
		if(this.enabled){
			switch (keynum) {
				// Controls
				case 65:
				case 37:
					this.left = true;
					break;
				case 87:
				case 38:
					this.up = true;
					break;
				case 68:
				case 39:
					this.right = true;
					break;
				case 83:
				case 40:
					this.down = true;
					break;
			};
		}
	};
	
	//CreateGame <-->
	var createGame = function(game){;
		var gID = gs.aTA(gs.games,game);
		gs.games[gID].gID = gID;
		gs.games[gID].creator = this.id;
		this.joinGame(gID);
	}
	var createEGame = function(game){;
		var gID = gs.aTA(gs.games,game);
		gs.games[gID].gID = gID;
		gs.games[gID].creator = this.id;
		return gID;
	}
	var joinGame = function(gameID){
		if(gameID==this.curGame)return;
		var oldGame=gameID;
		if(gs.games[gameID]){
			if(gs.games[gameID].playerCount<gs.games[gameID].playerCap){
				gs.games[gameID].addPlayer(this);
				this.curGame = gameID;
			}else{
				console.log("Game "+gameID+" Is Full");
			}
		}else{
			console.log("Invalid Game : "+gameID);
		}
		console.log("Player "+this.id+" joined "+gameID);
	};
	var fjoinGame = function(gameID){
		if(gameID==this.curGame)return;
		var oldGame=gameID;
		if(gs.games[gameID]){
			gs.games[gameID].addPlayer(this);
			this.curGame = gameID;
		}else{
			console.log("Invalid Game : "+gameID);
		}
		console.log("Player "+this.id+" joined "+gameID);
	};
	
	var onKeyUp = function(keynum){
		if(this.enabled){
			switch (keynum) {
				case 65:
				case 37:
					this.left = false;
					break;
				case 87:
				case 38:
					this.up = false;
					break;
				case 68:
				case 39:
					this.right = false;
					break;
				case 83:
				case 40:
					this.down = false;
					break;
			};
		}
	};
	var enable = function(){
		this.enabled=true;
	}
	var update = function() {
		if(this.enabled){
			if (this.up) {
				this.y -= this.moveSpeed;
			}
			if (this.down) {
				this.y += this.moveSpeed;
			}
			if (this.left) {
				this.x -= this.moveSpeed;
			}
			if (this.right) {
				this.x += this.moveSpeed;
			}
			if(this.x<gs.games[this.curGame].minX){
				this.x=gs.games[this.curGame].minX;
			}
			if(this.x>gs.games[this.curGame].maxX){
				this.x=gs.games[this.curGame].maxX;
			}
			if(this.y<gs.games[this.curGame].minY){
				this.y=gs.games[this.curGame].minY;
			}
			if(this.y>gs.games[this.curGame].maxY){
				this.y=gs.games[this.curGame].maxY;
			}
		}
	};
	
	var isInBounds = function(x1,y1,x2,y2){
		return (this.x>x1&&this.x<x2)&&(this.y>y1&&this.y<y2);
	}
	var sendChatMessage = function(message){
		this.send("1|"+message);
	}
	var send = function(message){
		if(this.ws.readyState == WebSocket.OPEN)
			this.ws.send(message);
	}
	var hasMoved = function(){
		return this.up||this.down||this.left||this.right;
	}
	
	var resetSpeed = function(){
		this.moveSpeed=4;
	}
	
    return {
		getPing: getPing,
		moveSpeed: moveSpeed,
		resetSpeed: resetSpeed,
		beat: beat,
		counterBeat: counterBeat,
		createGame: createGame,
		createEGame: createEGame,
		curGame: curGame,
		joinGame: joinGame,
		fjoinGame: fjoinGame,
		update: update,
        x: x,
        y: y,
		hasMoved:hasMoved,
        id: id,
		ws: ws,
		width: width,
		height: height,
		name: name,
		up: up,
		down: down,
		left: left,
		right: right,
		isInBounds: isInBounds,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp,
		send: send,
		sendChatMessage: sendChatMessage,
		enable: enable,
		enabled: enabled,
		color: color
    }
};
exports.Player = Player;