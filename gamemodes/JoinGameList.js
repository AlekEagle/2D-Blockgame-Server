var GT = require("../Games.js");
var gs = require('../game.js');
function JGL(_gn){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 3;
	this.playerCap = 1;
	this.ticksBeforeclose=gs.config.desiredTPS*5;
	this.onConnect = function(Pl){
		Pl.x=250;Pl.y=250;
		this.data['Sel']=0;
		this.data['L']=[];
	};
	this.onDraw = function(pID){
		var drawString="";		
		var e=1;
		for(var i=0;i<this.data['L'].length;i++){
			if(this.data['L'][i]){
				var yoff = i*60-this.data['Sel']*60+175;
				if(this.data['L'][i].data['V']!="Public"){
					continue;
				}
				if(yoff<0){
					continue;
				}
				if(yoff>440){
					continue
				}
				
				drawString += "3|"+(e++)+"|5|350|"+(5+yoff)+"|#AAAAAA|#000000§500§"+(60+yoff)+"~";
				drawString += "3|"+(e++)+"|1|435|"+(25+yoff)+"|#000000|"+this.data['L'][i].GameName+" ("+this.data['L'][i].gID+")~";
				drawString += "3|"+(e++)+"|1|435|"+(25+yoff)+"|#000000|^Game Type: ^Players :§end~";
				drawString += "3|"+(e++)+"|1|435|"+(25+yoff)+"|#000000|^"+this.data['L'][i].data['T'].name+" ^ "+this.data['L'][i].playerCount+"/"+this.data['L'][i].playerCap+":§start~";//GameName! Password!
			}
		}
		
		if(e>1){
			drawString += "3|"+(e++)+"|6|310|205|#000000|310§225^330§215~";
			drawString += "3|"+(e++)+"|1|305|220|#000000|Current§end~";
		}else{
			drawString += "3|"+(e++)+"|1|305|220|#000000|There are no games available~";
			e++;
		}
		
		drawString += "3|"+(e++)+"|5|75|75|#00FF00|#000000§125§125~";
		drawString += "3|"+(e++)+"|1|100|100|#000000|Go~";
		
		drawString += "3|"+(e++)+"|5|75|375|#FF0000|#000000§125§425~";
		drawString += "3|"+(e++)+"|1|100|395|#000000|Go^Back~";
		return drawString;
	};
	this.onKeyDown = function(pID,keyCode){
		if(keyCode==5671||keyCode==190)
			this.data['Sel']++;
		if(keyCode==5672||keyCode==188)
			this.data['Sel']--;
		
		this.players[pID].onKeyDown(keyCode);
	}
	this.onUpdate = function(Pl){
		this.data['Sel'] = parseInt(this.data['Sel']);
		if(this.data['Sel']<0){
			this.data['Sel']=0;
		}
		if(this.data['Sel']>this.data['L'].length-1){
			this.data['Sel']=this.data['L'].length-1;
		}
		if(Pl.isInBounds(75,375,125,425)){
			Pl.joinGame(gs.getLobbyID());
		}
		if(Pl.isInBounds(75,75,125,125)){
			if(this.data['L'][this.data['Sel']])
				Pl.joinGame(this.data['L'][this.data['Sel']].gID);
		}
		var oldLen=this.data['L'].length;
		this.data['L']=[];
		for(var i=0;i<gs.games.length;i++)
		{
			if(gs.games[i])
				if(gs.games[i].GameType==5)
					this.data['L'].push(gs.games[i]);
					
		}
		if(oldLen!=this.data['L'].length){
			this.clearDrawCache();
		}
	};
};
module.exports = JGL;