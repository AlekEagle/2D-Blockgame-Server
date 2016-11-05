
var gs = require('./game.js');
var GameModes = require('./gamemodes/');
var cH = require("./commandhandler.js");

function GameMode(_gn){
	this.GameType = -1;
	this.GameName = _gn;
	//Tag  &  Capture the flag  & Tower Defence
	this.GameTypes = gs.gameTypes;
	this.gID=-1;
	this.creator=-1;
	this.canJDuring=false;
	this.players = [];
	this.minX=5;this.minY=5;
	this.maxX=505;this.maxY=505;
	this.data=[];
	this.cachedata=[];
	this.emptyTicks=0;
	this.ticksBeforeclose=gs.config.desiredTPS*150;
	this.isMainLobby=(this.GameName!="Lobby #0");
	console.log(_gn+" created "+this.isMainLobby);
	this.playerCap = 0;
	this.playerCount = 0;
	this.addPlayer = function(Pl){
		Pl.resetSpeed();
		this.players[Pl.id] = Pl;
		this.playerCount++;
		this.onConnect(this.players[Pl.id]);
		this.clearDrawCache();
	}
	this.delPlayer = function(Pl){
		this.onDisconnect(this.players[Pl.id]);
		if(this.players[Pl.id]){
			gs.rFA(this.players,Pl.id);
			this.playerCount--;
		}
		this.clearDrawCache();
	}
	this.clearDrawCache = function(){
		for(var i=0;i<this.players.length;i++){
			if(this.players[i]){
				this.cachedata[i] = [];
				this.cachedata[i]["PrevData"] = [];
			}
		}
	}
	this.onChatMessage = function(pID,message,chatType){
		if(message.substring(0,1)==="/"){
			cH.handleP(this.players[pID],message);
		}else{
			message = message.substring(0,120).replace(/<\/?[^>]+(>|$)/g, "");
			for(var i=0;i<this.players.length;i++){
				if(this.players[i]){
					console.log("Sent "+pID+"'s message to "+i);
					this.players[i].sendChatMessage("["+this.players[pID].name+"]:"+message);
				}
			}
		}
	}
	this.onKeyDown = function(pID,keyCode){
		this.players[pID].onKeyDown(keyCode);
	}
	this.onKeyUp = function(pID,keyCode){
		this.players[pID].onKeyUp(keyCode);
	}
	this.onMouseMove = function(pID,x,y){}
	this.update = function(){
		if(this.isMainLobby==true){
			if(this.playerCount==0){
				if(this.emptyTicks>=this.ticksBeforeclose){
					gs.rFA(gs.games,this.gID);
				}else{
					this.emptyTicks++;
				}
			}
		}
		for(var i = 0;i<this.players.length;i++){
			if(this.players[i]){
				if(this.players[i].curGame!=this.gID){
					this.delPlayer(this.players[i]);
					continue;
				}
				var offs=this.getOffset(this.players[i]);
				var xoff=offs[0]; var yoff=offs[1];
				this.players[i].update();
				this.onUpdate(this.players[i]);
				var datastring = this.onDraw(i);
				if(!(this.GameType>=10&&this.GameType<=20)){
					for(var d = 0;d<this.players.length;d++){
						if(this.players[d]&&d!=i)
							datastring += "3|"+(Math.ceil(d+i/2*3)+29900)+"|2|"+(this.players[d].x-5+xoff)+"|"+(this.players[d].y-5+yoff)+"|"+this.players[d].color+"|#000000§"+this.players[d].name+"~";
					}
					datastring += "3|29999|2|"+(this.players[i].x-5)+"|"+(this.players[i].y-5)+"|"+this.players[i].color+"|#ff5500§"+this.players[i].name+"~";
				}
				datastring += "3|30000|4|"+(this.minX-5)+"|"+(this.minY-5)+"|#000000|NAN§"+(this.maxX+5)+"§"+(this.maxY+5)+"~";
				if(xoff==-1)
					xoff=this.players[i].width/2-this.players[i].x;
				if(yoff==-1)
					yoff=this.players[i].height/2-this.players[i].y;
				datastring += this.onDrawScoreBoard(this.players[i],xoff,yoff);
				//cachedata properly.
				if(this.cachedata[i]['PrevData']['xyoff']=="3|0|"+xoff+"|"+yoff+"~"){
					var FinalString = "";
				}else{
					if(!this.cachedata[i]['PrevData']['xyoff'])
						var FinalString = "2|0|"+xoff+"|"+yoff+"~";
					else
						var FinalString = "3|0|"+xoff+"|"+yoff+"~";
					
					this.cachedata[i]['PrevData']['xyoff']= "3|0|"+xoff+"|"+yoff+"~";
				}
				var notCached = datastring.split("~");
				for(var c=0;c<notCached.length;c++){
					if(notCached[c]&&notCached[c].split("|")&&notCached[c].split("|")[1]){
						if(this.cachedata[i]['PrevData'][notCached[c].split("|")[1]]!=notCached[c]){
							FinalString += notCached[c]+"~";
						}
						this.cachedata[i]['PrevData'][notCached[c].split("|")[1]] = notCached[c];
					}
				}
				if(FinalString.length>0){
					if(FinalString.substring(0,4)!="3|0|"&&FinalString.substring(0,4)!="2|0|")
						FinalString = "3|0|"+xoff+"|"+yoff+"~"+FinalString;
					this.players[i].send(FinalString);
				}
			}
		}
		this.onTick();
	}
	this.close = function(){
		console.log("Game Closed! Sending Players To An Open Lobby");
		for(var i = 0;i<this.players.length;i++){
			if(this.players[i]&&this.players[i].curGame == this.gID){
				
				console.log("Sent "+i+" To Lobby");
				this.players[i].joinGame(gs.getLobbyID());
			}
		}
		gs.rFA(gs.games,this.gID);
	}
	//OVERRIDE THESE
	this.onConnect = function(Pl){};
	this.onDisconnect = function(Pl){};
	this.onDraw = function(pID){return "~";};
	this.onUpdate = function(Pl){};
	this.onTick = function(){};
	this.onDrawScoreBoard = function(Pl,xoff,yoff){return "~";};
	this.getOffset = function(Pl){return [-1,-1];};
}
//LandWars 
//Maybe some kind of Dota
//Drawing
//Arena (with weapons :o)
//Snake
//PingPong

//RPG
/**
maybe some day... right? RIGHT? RTfaSVASDSARIGHT?!?!?!?!
*/
exports.GameMode = GameMode;
exports.ML = GameModes.ML;
exports.CGM = GameModes.CGM;
exports.CGL = GameModes.CGL;
exports.JGID = GameModes.JGID;
exports.JGL = GameModes.JGL;
exports.Drawing = GameModes.Drawing;
exports.Race = GameModes.Race;
exports.Snake = GameModes.Snake;
exports.PingPong = GameModes.PingPong;
exports.LandWars = GameModes.LandWars;
exports.adminRoom = GameModes.adminRoom;