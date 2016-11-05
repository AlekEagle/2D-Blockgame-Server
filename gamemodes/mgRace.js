var GT = require("../Games.js");
var gs = require('../game.js');
function race(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 14;
	this.playerCap = _gd['C'];
	this.minX=5;this.minY=5;this.maxX=75005;this.maxY=505;
	this.started=false;
	this.ticks=60*5;
	this.players= [];
	this.obsticles = [];
	this.winners = [];
	this.contestants = [];
	this.onConnect = function(Pl){
		Pl.x=50;
		Pl.moveSpeed=0;
		if(this.obsticles.length==0){
			var obscount = 0;
			for(var i=0;i<7500;i++){
				if(Math.random()>0.95){
					this.obsticles[obscount]=[Math.floor(Math.random()*500)-50,i*10,0,Math.floor(Math.random()*100)+50];
					if(this.obsticles[obscount][0]+this.obsticles[obscount][3]>this.maxY){
						this.obsticles[obscount][0]-=(this.obsticles[obscount][0]+this.obsticles[obscount][3])-(this.maxY+5);
					}
					if(this.obsticles[obscount][0]<this.minY){
						this.obsticles[obscount][0]=this.minY-5;
					}
					obscount++;
				}
			}
		}
	};
	this.parsePlacement = function(place){
		if(place%10==1){return place+"st";}
		if(place%10==2){return place+"nd";}
		if(place%10==3){return place+"rd";}
		return place+"th";
	};
	this.onDisconnect = function(Pl){};
	this.onDraw = function(pID){
		var drawString="";var e=1;
		var Pl = this.players[pID];
		var offs=this.getOffset(this.players[i]);
		var xoff=offs[0]; var yoff=offs[1];
		var i = pID;
		drawString += "3|"+(e++)+"|5|75|0|"+(this.started?(this.ticks/60>3?"#F00":this.ticks/60>2?"#FF0":"#0F0"):"#0F0")+"|"+(this.started?(this.ticks/60>3?"#F00":this.ticks/60>2?"#FF0":"#0F0"):"#0F0")+"§85§505~";
		drawString += "3|"+(e++)+"|5|74975|0|#FF0|#FF0§74980§505~";
		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]&&d!=i)
				drawString += "3|"+(Math.ceil(d+i/2*3)+29900)+"|2|"+(this.players[d].x-5+xoff)+"|"+(this.players[d].y-5+yoff)+"|#f00|#000000§"+this.players[d].name+"~";
		}
		drawString += "3|29999|2|"+(this.players[i].x-5)+"|"+(this.players[i].y-5)+"|#0ff|#ff5500§"+this.players[i].name+"~";
		if(this.ticks>0)
			drawString += "3|"+(e++)+"|1|250|250|#ff0000|"+(Math.round(this.ticks/60))+"~";
		else
			drawString += "3|"+(e++)+"|1|250|250|#00ff00|GO!~";
		for(var o=0;o<this.obsticles.length;o++){
			var obs = this.obsticles[o];
			if(obs){
				switch(obs[2]){
					case 0:
						drawString+="3|"+(e++)+"|5|"+(obs[1]-15)+"|"+(obs[0])+"|#F00|#F00§"+(obs[1]-5)+"§"+(obs[0]+obs[3])+"~";
						break;
					case 1:
					case 2:
				}
			}
		}
		drawString += "3|"+(e++)+"|5|75|0|#00FF00|#00FF00§85§505~";
		if(this.winners.length>0){
			drawString += "3|"+(e++)+"|1|75250|0|#000000|Winners:^";
			for(var d=0;d<this.winners.length;d++){
				if(this.winners[d]){
					drawString += "^"+this.parsePlacement(d+1);
					drawString += " place : "+this.winners[d].name;
				}
			}
		}
		drawString += "~";
		return drawString;
	};
	this.onUpdate = function(Pl){
		if(this.started&&Pl.moveSpeed==0){
			Pl.moveSpeed=15;
		}
		if(Math.abs(this.ticks)%60==0&&this.started){
			Pl.moveSpeed++;
		}
		for(var o=0;o<this.obsticles.length;o++){
			var obs = this.obsticles[o];
			if(obs){
				switch(obs[2]){
					case 0:
						if(Pl.isInBounds(obs[1]-Pl.moveSpeed,obs[0],obs[1]+10,obs[0]+obs[3])){Pl.x-=15;Pl.moveSpeed=15;}
						break;
					case 1:
					case 2:
				}
			}
		}
		if(Pl.x>74975){
			Pl.moveSpeed=0;
			if(this.winners.indexOf(Pl)==-1){
				this.winners[this.winners.length]=Pl;
				Pl.sendChatMessage("You finished "+this.parsePlacement(this.winners.length))
				for(var d=0;d<this.players.length;d++){
					if(this.players[d])
						this.players[d].moveSpeed=0;
				}
			}
		}
	};
	this.onTick = function(){
		this.ticks-=1;
		if(!this.started){
			if(this.ticks<0){
				this.started=true;
			}
		}
		if(Math.abs(this.ticks)%20==0){
		try{
			this.contestants=[];var co=0;
			for(var p=0;p<this.players.length;p++){
				if(this.players[p]){
					this.contestants[co++]=this.players[p];
				}
			}
			for(var i=0;i<this.contestants.length;i++){
				var j;
				curr = this.contestants[i]
				for(j=i-1;j>-1&&this.contestants[j].x<curr.x;j--){
					this.contestants[j+1]=this.contestants[j]
				}
				this.contestants[j+1]=curr;
			}
			console.log(JSON.stringify({"t":tempc,"c":this.contestants}));
			}catch(e){}
		}
	};
	this.onDrawScoreBoard = function(Pl,xoff,yoff){
		var drawString = "";
		drawString += "3|99600|0|"+(Pl.width-xoff-200)+"|"+(0-yoff)+"|#777777|§"+(Pl.width-xoff)+"§"+(100-yoff)+"~";
		drawString += "3|99601|1|"+(Pl.width-xoff-100)+"|"+(15-yoff)+"|#ffffff|RACING§center~";
		drawString += "3|99602|1|"+(Pl.width-xoff-100)+"|"+(30-yoff)+"|#ffffff|Speed : "+Pl.moveSpeed+"km/h§center~";
		drawString += "3|99603|1|"+(Pl.width-xoff-100)+"|"+(45-yoff)+"|#ffffff|You Are In "+this.parsePlacement(this.contestants.indexOf(Pl)+1)+"§center~";
		drawString += "3|99604|1|"+(Pl.width-xoff-100)+"|"+(60-yoff)+"|#ffffff|"+(Pl.x/1000)+"km / "+((this.maxX-this.minX)/1000)+"km§center~";
		return drawString;
	};
	this.getOffset = function(Pl){return [-1,-1];};
}
module.exports=race