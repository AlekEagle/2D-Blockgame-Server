var GT = require("../Games.js");
var gs = require('../game.js');
function CGM(_gn){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 2;
	this.playerCap = 1;
	this.ticksBeforeclose=gs.config.desiredTPS*5;
	this.onConnect = function(Pl){
		Pl.x=250;Pl.y=250;
		this.data['GD'] = [];
		this.data['GD']['V'] = "Public";
		this.data['GD']['C'] = 10;
		this.data['GD']['T'] = this.GameTypes[0];
	};
	this.onDraw = function(pID){
		var drawString="";
		var e=1;
		drawString += "3|"+(e++)+"|5|75|75|#33CCFF|#000000§125§125~";
		drawString += "3|"+(e++)+"|1|100|100|#000000|Player^Cap:^^"+this.data['GD']['C']+"~";
		
		drawString += "3|"+(e++)+"|5|75|225|#33CCFF|#000000§125§275~";
		drawString += "3|"+(e++)+"|1|100|250|#000000|Game^Type:^^"+this.data['GD']['T'].name+"~";
		
		drawString += "3|"+(e++)+"|5|75|375|#33CCFF|#000000§125§425~";
		drawString += "3|"+(e++)+"|1|100|400|#000000|Game^Access:^^"+this.data['GD']['V']+"~";
		
		drawString += "3|"+(e++)+"|5|375|75|#FF0000|#000000§425§125~";
		drawString += "3|"+(e++)+"|1|400|105|#000000|Cancel~";
		
		drawString += "3|"+(e++)+"|5|375|375|#00FF00|#000000§425§425~";
		drawString += "3|"+(e++)+"|1|400|405|#000000|Create~";
		
		drawString += "3|"+(e++)+"|1|250|20|#00FF00|Go on the squares and^use the scroll wheel or '<' and '>' to change variables~";

		return drawString;
	};
	this.onKeyDown = function(pID,keyCode){
		if(this.players[pID].isInBounds(75,75,125,125)){
			if(keyCode==5671||keyCode==190)
				this.data['GD']['C']++;
			if(keyCode==5672||keyCode==188)
				this.data['GD']['C']--;
		}
		if(this.players[pID].isInBounds(75,225,125,275)){
			var nextID=this.GameTypes.indexOf(this.data['GD']['T']);
			if(keyCode==5671||keyCode==190)
				nextID++;
			if(keyCode==5672||keyCode==188)
				nextID--;
				if(nextID>this.GameTypes.length-1){nextID=0;}if(nextID<0){nextID=this.GameTypes.length-1;}
				this.data['GD']['T'] = this.GameTypes[nextID];
		}
		if(this.players[pID].isInBounds(70,370,130,430)){
			if(keyCode==190||keyCode==188||keyCode==5671||keyCode==5672)
				this.data['GD']['V'] = this.data['GD']['V']=="Public"?"Private":"Public";
		}
		this.players[pID].onKeyDown(keyCode);
	}	
	this.onUpdate = function(Pl){
		if(this.data['GD']['C']>this.data['GD']['T'].maxPlayers){
			this.data['GD']['C']=this.data['GD']['T'].maxPlayers;
		}
		if(this.data['GD']['C']<this.data['GD']['T'].minPlayers){
			this.data['GD']['C']=this.data['GD']['T'].minPlayers;
		}
		if(this.data['GD']['C']<1){
			this.data['GD']['C']=1
		}
		if(Pl.isInBounds(375,75,425,125)){
			Pl.joinGame(gs.getLobbyID());
		}
		if(Pl.isInBounds(375,375,425,425)){
			Pl.createGame(new GT.CGL("Game Lobby ",this.data['GD']));
		}
	};
};
module.exports = CGM;