var GT = require("../Games.js");
var gs = require('../game.js');
function pingpong(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 13;
	this.playerCap = _gd['C'];
	this.minX=5;this.minY=5;this.maxX=505;this.maxY=505;
	this.ball = {x:this.maxX/2,y:this.maxY/2,vx:Math.random()*6-3,vy:Math.random()<0.5?3:-3,r:4};	
	this.d = 0;
	this.data['s'] = 0;
	this.data['h'] = 0;
	this.data['ps'] = [];
	this.data['ps'][0] = 0;
	this.data['ps'][1] = 0;
	this.paddles = [];
	this.hasAI = _gd['C']!=this.players.length;
	//AI IF PLAYERCAP == 2 && players != 2
	
	this.onConnect = function(Pl){
		Pl.down=false;Pl.up=false;
		if(this.d==0){
			this.paddles[0]=Pl;
			Pl.x=this.maxX/2;
			Pl.y=this.minY+10;
			this.d++;
		}else{
			this.d++;
			this.paddles[1]=Pl;
			Pl.x=this.maxX/2;
			Pl.y=this.maxY;
		}
		Pl.moveSpeed=12;
		console.log(this.players);
	}
	this.getOffset = function(Pl){
		//Center it. dont move it.
		return [Pl.width/2-this.maxX/2,Pl.height/2-this.maxY/2];
	}
	this.onDraw = function(pID){
		var drawString="";var e=1;
		var Pl = this.players[pID];
		//Start Drawing
		//flip if not on bottom
		//Ball
		drawString += "3|1|6|"+this.ball.x+"|"+this.ball.y+"|#ff00ff|"+this.ball.x+"§"+this.ball.y+"§2§"+this.ball.r+"§0§6.28318530718~"; 
		//Player
		drawString += "3|5|0|"+(this.players[pID].x-50)+"|"+(this.players[pID].y)+"|#00ffff|§"+(this.players[pID].x+50)+"§"+(this.players[pID].y-10)+"~";
		//Opponent
		for(var i=0;i<this.players.length;i++){
			if(this.players[i]&&i!=pID)
				drawString += "3|6|0|"+(this.players[i].x-50)+"|"+(this.players[i].y)+"|#ff0000|§"+(this.players[i].x+50)+"§"+(this.players[i].y-10)+"~";
		}
		//flip back
		//Stop Drawing
		return drawString;
	}
	this.onDrawScoreBoard = function(Pl,xoff,yoff){
		var drawString = "";
		drawString += "3|600|0|"+(Pl.width-xoff-200)+"|"+(0-yoff)+"|#777777|§"+(Pl.width-xoff)+"§"+(100-yoff)+"~";
		if(this.d>1){
			//Title
			drawString += "3|601|1|"+(Pl.width-xoff-100)+"|"+(15-yoff)+"|#ffffff|Competitive§center~";
			drawString += "3|602|1|"+(Pl.width-xoff-100)+"|"+(30-yoff)+"|#ffffff|1 v 1§center~";
			//Names
			drawString += "3|603|1|"+(Pl.width-xoff-150)+"|"+(45-yoff)+"|#00ffff|You§center~";
			drawString += "3|604|1|"+(Pl.width-xoff-100)+"|"+(45-yoff)+"|#ffffff|vs§center~";
			var opponent;
			for(var i=0;i<this.players.length;i++){if(this.players[i]){if(i!=Pl.id){var opponent = this.players[i];}}}
			
			drawString += "3|605|1|"+(Pl.width-xoff-50)+"|"+(45-yoff)+"|#ff6600|"+opponent.name+"§center~";
			
			if(this.paddles[0]==Pl){
				drawString += "3|606|1|"+(Pl.width-xoff-150)+"|"+(60-yoff)+"|#00ffff|"+this.data['ps'][0]+"  §center~";
				drawString += "3|607|1|"+(Pl.width-xoff-50)+"|"+(60-yoff)+"|#ff6600|"+this.data['ps'][1]+"  §center~";
			}else{
				drawString += "3|606|1|"+(Pl.width-xoff-150)+"|"+(60-yoff)+"|#00ffff|"+this.data['ps'][1]+"  §center~";
				drawString += "3|607|1|"+(Pl.width-xoff-50)+"|"+(60-yoff)+"|#ff6600|"+this.data['ps'][0]+"  §center~";
			}
		}else{
			drawString += "3|601|1|"+(Pl.width-xoff-100)+"|"+(15-yoff)+"|#ffffff|Keep Ups§center~";
			drawString += "3|602|1|"+(Pl.width-xoff-100)+"|"+(40-yoff)+"|#ffffff|Ball has bounced "+this.data['s']+" time"+(this.data['s']==1?"":"s")+"§center~";
			drawString += "3|603|1|"+(Pl.width-xoff-100)+"|"+(55-yoff)+"|#ffffff|High Score "+this.data['h']+" time"+(this.data['h']==1?"":"s")+"§center~";
			if(this.data['s']>this.data['h']){this.data['h']=this.data['s'];}
			
		}
		drawString += "3|630|1|"+(Pl.width-xoff-100)+"|"+(75-yoff)+"|#ff6600|Ball Speed : "+(Math.round((Math.abs(this.ball.vx)+Math.abs(this.ball.vy))*100)/100)+"km/h  §center~";
		return drawString;
	}
	this.onUpdate = function(Pl){
		if(Pl.x<this.minX+45){Pl.x=this.minX+45;}
		if(Pl.x>this.maxX-45){Pl.x=this.maxX-45;}
	}
	this.reset = function(){
		this.ball.vx=Math.random()*6-3;this.ball.vy=Math.random()<0.5?3:-3;this.ball.x=this.maxX/2;this.ball.y=this.maxY/2;this.data['s']=0;
	}
	this.collided = function(Pl){
		//If player is moving add momentum.
		if(Pl.right){
			this.ball.vx += Pl.moveSpeed/3;
		}
		if(Pl.left){
			this.ball.vx += -Pl.moveSpeed/3;
		}
		this.ball.vy = -this.ball.vy;
		this.ball.vy += this.ball.vy<0?-Math.random()/12:Math.random()/12;
		this.data['s']++;
		this.ball.vx += Math.random()/100;
		this.ball.vy += this.ball.vy<0?-0.25:0.25;
	}
	
	this.onTick = function(){
		this.ball.x += this.ball.vx;
		if(this.ball.x-this.ball.r<this.minX||this.ball.x+this.ball.r>this.maxX){
			this.ball.vx = -(this.ball.vx);
			if(Math.abs(this.ball.vx)>10){
				this.ball.vx += this.ball.vx<0?Math.random()/8:-Math.random()/8;
			}else{
				this.ball.vx += this.ball.vx<0?-Math.random()/8:Math.random()/8;
			}
		}
		this.ball.y += this.ball.vy;
		if(this.ball.y-this.ball.r<this.minY){
			this.reset();
			this.data['ps'][1]++;
			//player 1
		}
		if(this.ball.y+this.ball.r>this.maxY){
			//endGame
			//player 2
			if(this.d>1){
				this.data['ps'][0]++;
				this.reset();
			}else{
				this.ball.vy=-this.ball.vy;
			}
		}
		//Collision
		for(var i=0;i<this.paddles.length;i++){
			if(this.paddles[i]){
				var Pl = this.paddles[i];
				if(i==0){
					if(this.ball.x+this.ball.r>Pl.x-50&&this.ball.x-this.ball.r<Pl.x+50){
						if(this.ball.y+this.ball.r<Pl.y+10){
							this.collided(Pl);
						}
					}
				}
				if(i==1){
					if(Pl.name=="AI"&&Pl.width==-1){
						if(this.ball.x+this.ball.r>Pl.x-50&&this.ball.x-this.ball.r<Pl.x+50){
							if(this.ball.y+this.ball.r>Pl.y){
								this.collided(Pl);
							}
						}
					}else{
						if(this.ball.x+this.ball.r>Pl.x-50&&this.ball.x-this.ball.r<Pl.x+50){
							if(this.ball.y+this.ball.r>Pl.y-10){
								this.collided(Pl);
							}
						}
					}
				}
			}
		}
	}
	this.onKeyDown = function(pID,keyCode){
		if(keyCode==37||keyCode==39){
			this.players[pID].onKeyDown(keyCode);
		}
		if(keyCode==16){
			this.players[pID].moveSpeed=24;
		}
	}
	this.onKeyUp = function(pID,keyCode){
		this.players[pID].onKeyUp(keyCode);
		if(keyCode==16){
			this.players[pID].moveSpeed=12;
		}
	}
	this.onDisconnect = function(Pl){
		this.close();
	}
}
module.exports=pingpong;
