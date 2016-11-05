var GT = require("../Games.js");
var gs = require('../game.js');
//If you ever find out how to claim land. call o7
function LandWars(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 10;
	this.playerCap = _gd['C'];
	this.data=_gd;
	this.PixelData = [];
	this.data['hasnew']=false;
	for(var x=this.minX;x<this.maxX;x+=5){
		for(var y=this.minY;y<this.maxY;y+=5){
		//	this.PixelData[x+"§"+y] = "#ffffff";
		}
	}
	this.onDraw = function(pID){
		var drawString = "";
		var e=0;
		if(this.data['hasnew']==true){
			for(var posit in this.PixelData){
				var pixelX = posit.split("§")[0]*5;
				var pixelY = posit.split("§")[1]*5;
				if(!this.cachedata[pID]['PrevData'][pixelX/5+""+pixelY/5]){
					var color = this.PixelData[posit];
					drawString += "3|"+((pixelX/5)+""+(pixelY/5))+"|0|"+pixelX+"|"+pixelY+"|"+color+"|NAN§"+(pixelX-(-5))+"§"+(pixelY-(-5))+"~";
				}
			}
		this.data['hasnew']=false;
		}
		
		return drawString;
	}
	this.onUpdate = function(Pl){
		this.players.forEach(
			function(player){
				if(!player.hasMoved()){
					return;
				}
				for(var x=-5;x<=5;x++){
					for(var y=-5;y<=5;y++){
						var key = Math.round(x-(-player.x-5)/5)+"§"+Math.round(y-(-player.y-5)/5);
						this.PixelData[key] = "#ff00ff";
						this.data['hasnew']=true;
					}
				}
			}
		,this);
	}
}
module.exports=LandWars;