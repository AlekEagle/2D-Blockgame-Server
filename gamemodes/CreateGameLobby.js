var GT = require("../Games.js");
var gs = require('../game.js');
function CGL(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 5;
	this.playerCap = _gd['C'];
	this.data=_gd;
	this.ticksBeforeclose=gs.config.desiredTPS*300;
	
	this.onConnect = function(Pl){
		Pl.x=250;Pl.y=250;
	};
	this.onDraw = function(pID){
		var drawString = "";
		var e=1;
		if(pID==this.creator){
			drawString += "3|"+(e++)+"|5|450|450|#FFA500|#000000§500§500~";
			drawString += "3|"+(e++)+"|1|475|475|#000000|Force^Start~";
			drawString += "3|"+(e++)+"|5|5|450|#FF0000|#000000§55§500~";
			drawString += "3|"+(e++)+"|1|30|475|#000000|Cancel^Game~";
		}else{
			drawString += "3|"+(e++)+"|5|5|450|#FFA500|#000000§55§500~";
			drawString += "3|"+(e++)+"|1|30|475|#000000|Go^Back~";
		}
		
		drawString += "3|"+(e++)+"|1|250|70|#00CC00|GameType : ^Players until autostart : ^ Visibility : ^ Game Code : §end~";
		drawString += "3|"+(e++)+"|1|250|70|#00ffff|"+this.data['T'].name+"^"+(this.playerCap-this.playerCount)+"^"+this.data['V']+"^"+this.gID+"§start~";
		drawString += "3|"+(e++)+"|1|250|400|#FF0000|The creator of the game can force-start~";
		return drawString;
	};
	this.onUpdate = function(Pl){
		if(Pl.isInBounds(5,450,55,500)){
			Pl.joinGame(gs.getLobbyID());
			if(Pl.id==this.creator){
				this.close();
			}
		}
		if(Pl.isInBounds(450,450,500,500)&&Pl.id==this.creator){this.createG(Pl);}
		if(this.playerCount==this.playerCap){this.createG(Pl);}
	}
	this.createG = function(Pl){
		var ngID = Pl.createEGame(new this.data['T'].obj(this.data['T'].name,this.data));
		console.log("Game "+ngID+" Created!");
		for(var i=0;i<this.players.length;i++){
			if(this.players[i]){
				console.log("Sending Player "+i+" to "+ngID);
				this.players[i].joinGame(ngID);
			}
		}
		console.log("Closing Game Lobby");
		this.close();
	}
};
module.exports = CGL;