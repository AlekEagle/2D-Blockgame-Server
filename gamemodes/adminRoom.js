var GT = require("../Games.js");
var gs = require('../game.js');
function adminRoom(_gn){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 6;
	this.playerCap = 1;
	this.onDraw = function(pID){
		var drawString="";
		var e=1;
		drawString += "3|"+(e++)+"|1|250|125|#000000|Welcome to the Admin Room§~";
		drawString += "3|"+(e++)+"|1|500|230|#000000|TPS : "+Math.round10(gs.tps(),-1)+"§end~";
		var playercount = 0;for(var i=0;i<gs.players.length;i++){if(gs.players[i])playercount++;}
		drawString += "3|"+(e++)+"|1|500|250|#000000|Players : "+playercount+"§end~";
		var gamescount = 0;for(var i=0;i<gs.games.length;i++){if(gs.games[i])gamescount++;}
		drawString += "3|"+(e++)+"|1|500|270|#000000|Games : "+gamescount+"§end~";
		
		
		drawString += "3|"+(e++)+"|5|225|375|#FF0000|#000000§275§425~";
		drawString += "3|"+(e++)+"|1|250|395|#000000|Go^Back~";
		return drawString;
	}
	this.onUpdate = function(Pl){
		if(Pl.isInBounds(225,375,275,425)){
			Pl.joinGame(gs.getLobbyID());
		}
	}
}
module.exports=adminRoom;