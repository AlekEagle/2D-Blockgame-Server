var GT = require("../Games.js");
var gs = require('../game.js');

module.exports = ML;

function ML(_gn){
	console.log(GT);
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 1;
	this.playerCap = 10;
	this.ticksBeforeclose=gs.config.desiredTPS*300;
	this.onConnect = function(Pl){
		Pl.x=250;Pl.y=250;
	};
	this.onDraw = function(pID){
		var drawString="";
		var e=1;
		
		drawString += "3|"+(e++)+"|5|75|75|#33CCFF|#000000§125§125~";
		drawString += "3|"+(e++)+"|1|100|90|#000000|Enter^Game^ID~";
		
		drawString += "3|"+(e++)+"|5|75|375|#33CCFF|#000000§125§425~";
		drawString += "3|"+(e++)+"|1|100|390|#000000|View^Public^Games~";
		
		drawString += "3|"+(e++)+"|5|375|75|#00FF00|#000000§425§125~";
		drawString += "3|"+(e++)+"|1|400|100|#000000|Create^Game~";
		
		return drawString;
	};
	this.onUpdate = function(Pl){
		if(Pl.isInBounds(75,75,125,125)){
			Pl.createGame(new GT.JGID(Pl.name+"("+Pl.id+") JGID"));
		}
		if(Pl.isInBounds(75,375,125,425)){
			Pl.createGame(new GT.JGL(Pl.name+"("+Pl.id+") JGL"));
		}
		if(Pl.isInBounds(375,75,425,125)){
			Pl.createGame(new GT.CGM(Pl.name+"("+Pl.id+") CGM"));
		}
	};
};