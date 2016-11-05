var GT = require("../Games.js");
var gs = require('../game.js');
function JGID(_gn){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 4;
	this.playerCap = 1;
	this.ticksBeforeclose=gs.config.desiredTPS*5;
	this.onConnect = function(Pl){
		Pl.x=250;Pl.y=250;
		this.data[Pl.id] = [];
		this.data[Pl.id]['Game Id'] = "";
	};
	this.data['TickC']=0;
	this.onDraw = function(pID){
		var drawString="";var e=1;
		drawString += "3|"+(e++)+"|1|250|105|#000000|Type in the desired GAME ID~";
		
		if(this.data['TickC']>gs.config.desiredTPS/2){
			drawString += "3|"+(e++)+"|1|250|125|#000000|"+this.data[pID]['Game Id']+" ~";
		}else{
			drawString += "3|"+(e++)+"|1|250|125|#000000|"+this.data[pID]['Game Id']+"_~";
		}

		this.data['TickC']++;if(this.data['TickC']==gs.config.desiredTPS){this.data['TickC']=0;};
		
		drawString += "3|"+(e++)+"|5|75|375|#33CCFF|#000000§125§425~";
		drawString += "3|"+(e++)+"|1|100|400|#000000|Clear~";
		
		drawString += "3|"+(e++)+"|5|375|375|#00FF00|#000000§425§425~";
		drawString += "3|"+(e++)+"|1|400|400|#000000|Go~";
		
		drawString += "3|"+(e++)+"|5|225|375|#FF0000|#000000§275§425~";
		drawString += "3|"+(e++)+"|1|250|395|#000000|Go^Back~";
		return drawString;
	};
	this.onUpdate = function(Pl){
		if(Pl.isInBounds(225,375,275,425)){
			Pl.joinGame(gs.getLobbyID());
		}
		if(Pl.isInBounds(75,375,125,425)){
			this.data[Pl.id]['Game Id']="";
			Pl.x=250;
			Pl.y=250;
		}
		if(Pl.isInBounds(375,375,425,425)){
			if(gs.games[parseInt(this.data[Pl.id]['Game Id'])]&&(gs.games[parseInt(this.data[Pl.id]['Game Id'])].GameType==5||gs.games[parseInt(this.data[Pl.id]['Game Id'])].canJDuring)){
				Pl.joinGame(this.data[Pl.id]['Game Id']);
			}
		}
	};
	this.onKeyDown = function(pID,keyCode){
		console.log(keyCode);
		if((keyCode>=65&&keyCode<=90)||(keyCode>=48&&keyCode<=57))
			this.data[pID]['Game Id'] += String.fromCharCode(keyCode).toLowerCase();
		if(keyCode>=96&&keyCode<=105)
			this.data[pID]['Game Id'] += String.fromCharCode(keyCode-48).toLowerCase();
		if(keyCode==8)
			this.data[pID]['Game Id'] = this.data[pID]['Game Id'].substring(0,this.data[pID]['Game Id'].length-1);
		//13 = enter
		/*48
		if(keyCode==13)
			this.players[pID].joinGame(this.data[Pl.id]['Game Id']);
		*/
		this.players[pID].onKeyDown(keyCode);
	}
};
module.exports = JGID;