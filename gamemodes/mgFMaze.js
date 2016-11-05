var GT = require("../Games.js");
var gs = require('../game.js');
var cH = require("../commandhandler.js");
function fmaze(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 15;
	this.canJDuring=true;
	this.playerCap = _gd['C'];
	this.minX=-50005;this.minY=-50005;
	this.maxX=50005;this.maxY=50005;
	this.mazeStartPos=[[3*64+32,1*64+32],[1*64+32,1*64+32+5000],[1*64+32,1*64+32+10000]];
	this.mazes=[
	[
		[0,0,0,0,0,0,0],
		[0,0,1,1,2,0,0],
		[0,0,1,0,0,0,0],
		[0,3,1,0,1,4,0],
		[0,0,1,0,1,0,0],
		[0,0,1,1,1,0,0],
		[0,0,0,0,0,0,0]
	],[
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0],
		[0,2,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,1,0],
		[0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0],
		[0,1,1,1,1,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,1,1,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0],
		[0,1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0],
		[0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
		[0,4,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0],
		[0,1,1,1,1,1,1,0,0,1,1,1,0,1,1,0,1,1,1,1,0,1,0],
		[0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0],
		[0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,0],
		[0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0],
		[0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
		[0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0],
		[0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0],
		[0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	[
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,3,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0],
		[0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0],
		[0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0],
		[0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0],
		[0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,2,1,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0],
		[0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0],
		[0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
		[0,1,0,1,0,1,0,4,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
		[0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0],
		[0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
		[0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]
	];
	this.questions=[["Factor : y = (x^2) + 15x - 16",["y=(x-1)(x+16)","y=(x+16)(x-1)","(x+16)(x-1)","(x-1)(x+16)"]],["The area of a square can be represented as 9(a^2)+48ab+64(b^2). The verticies of the square touch the circle. Determine the radius of the Circle if a=3cm and b=2cm.",["17.678","17.678cm","r=17.678","r=17.678cm"]],["One quadrent of a  4 pane window has an area of \"3(x^2) +16x(y^2) - 51x - 272(y^2)\". Determine the length and width of the full frame.",["6(3x+16(y^2))+6(x-17)","6(x-17)+6(3x+16(y^2))","24x+96(y^2)-102","-102+24x+96(y^2)","24x-102+96(y^2)"]]];
	this.players=[];
	
	this.onConnect = function(Pl){
		this.players[Pl.id]=Pl;
		this.players[Pl.id]["m"]=0;
		this.players[Pl.id]["s"]="f";
		this.players[Pl.id]["d"]=[];
		this.players[Pl.id]["f"]="f";
		this.players[Pl.id]["t"]=[];
		this.players[Pl.id]["t"]["started"]=new Date().getTime();
		this.players[Pl.id].moveSpeed=0;
		this.players[Pl.id].x=this.mazeStartPos[0][1];
		this.players[Pl.id].y=this.mazeStartPos[0][0];
	};
	this.onDisconnect = function(Pl){};
	this.onDraw = function(pID){
		var str = "~";var e=1;
		var Pl = this.players[pID];
		var offs=this.getOffset(Pl);
		var xoff=offs[0]; var yoff=offs[1];
		var m = Pl["m"];
		drawUs = [];
		drawPl = [];
		for(var a=0;a<360;a+=0.5){
			for(var d=0;d<64*8;d+=32){
				cosa = (Math.cos(a)*(d));
				sina = (Math.sin(a)*(d));
				x2 = ~~((cosa + Pl.x-5000*m)/64);
				y2 = ~~((sina + Pl.y)/64);
				if(this.mazes[m][y2]&&this.mazes[m][y2][x2]!=undefined){
					if(drawUs.indexOf(x2+"§"+y2)==-1)drawUs.push(x2+"§"+y2);
					for(var p = 0;p<this.players.length;p++){
						if(this.players[p]&&p!=pID)
							if(this.players[p]["m"]==m){
								x3 = ~~((this.players[p].x-5000*m)/64);
								y3 = ~~((this.players[p].y)/64);
								if(x3==x2&&y3==y2&&drawPl.indexOf(p)==-1){
									drawPl.push(p);
								}
							}
					}
					if(this.mazes[m][y2][x2]==0){d=9*64;}
				}
			}
		}
		for(var y=0;y<this.mazes[m].length;y++){
			for(var x=0;x<this.mazes[m][y].length;x++){
				vis = drawUs.indexOf(x+"§"+y)!=-1;
				if(this.mazes[m][y][x]==0)
					str += "3|"+(e++)+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+(vis?"#000":"#fff")+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==3)
					str += "3|"+(e++)+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+(vis?"#0f0":"#fff")+"|#0f0§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==2){str += "3|"+(e++)+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+(vis?"#ff99b3":"#fff")+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";str += "3|"+(e++)+"|1|"+(5000*(m)+x*64+32)+"|"+(y*64+32)+"|"+(vis?"#000":"#fff")+"|?~";}
				if(this.mazes[m][y][x]==4){str += "3|"+(e++)+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+(vis?"#ff0":"#fff")+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";}
			}
		} 
		/*for(var y=0;y<this.mazes[m].length;y++){
			for(var x=0;x<this.mazes[m][y].length;x++){
				if(this.mazes[m][y][x]==0)
					str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#000"+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==3)
					str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#0f0"+"|#0f0§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==2){str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#ff99b3"+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";str += "3|"+(e++)+"|1|"+(5000*(m)+x*64+32)+"|"+(y*64+32)+"|"+"#000"+"|?~";}
				if(this.mazes[m][y][x]==4){str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#ff0"+"|#000§"+(5000*(m)+x*64+64)+"§"+(y*64+64)+"~";}
			}
		}*/

		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]&&d!=pID)
				if(this.players[d]["m"]==m){
					str += "3|"+(d+29900)+"|2|"+(this.players[d].x-5+xoff)+"|"+(this.players[d].y-5+yoff)+"|"+(drawPl.indexOf(d)!=-1?"#f00":"#fff")+"|"+(drawPl.indexOf(d)!=-1?"#000":"#fff")+"§"+(drawPl.indexOf(d)!=-1?this.players[d].name:"")+"~";
				}
		}
		str += "3|"+(pID+29900)+"|2|"+(this.players[pID].x-5)+"|"+(this.players[pID].y-5)+"|#0ff|#ff5500§"+this.players[pID].name+"~";		
		return str;
	};
	this.onUpdate = function(Pl){};
	this.onTick = function(){
		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]){
				x = ~~((this.players[d].x-5000*(this.players[d]["m"]))/64);
				y = ~~((this.players[d].y)/64);
				m = this.players[d]["m"];
					if(this.mazes[m][y][x]==2){
						if(this.players[d]["s"]=="f"){
							this.players[d].sendChatMessage(this.questions[m][0]);
							this.players[d]["s"]="t";
							m=this.mazes.length;
						}
						if(this.players[d]["f"]=="f")this.players[d]["f"]="r";		
					}else if(this.mazes[m][y][x]==3){
						if(this.players[d]["s"]=="f"){this.players[d].sendChatMessage("Find the question! And find the exit!");this.players[d]["s"]="t";}
						if(this.players[d]["f"]=="t")this.players[d]["f"]="r";		
					}else if(this.mazes[m][y][x]==4){
						if(this.players[d]["s"]=="f"){this.players[d].sendChatMessage("Enter your answer into the chat by pressing Enter! Don't worry. Others wont see!"+(this.players[d]["m"]==1?"ROUND YOUR ANSWER TO 3 DECIMAL PLACES":""));this.players[d]["s"]="t";}
						if(this.players[d]["f"]=="r")this.players[d]["f"]="t";	
					}else{
						if(this.players[d]["f"]=="t")this.players[d]["f"]="r";		
						this.players[d]["s"]="f";
					}
			}
		}
		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]){
				x = this.players[d].x-5000*(this.players[d]["m"]);
				if(this.players[d]["d"][65]||this.players[d]["d"][37]){
					if(this.mazes[this.players[d]["m"]][~~((this.players[d].y)/64)][~~((x-7)/64)]!=0){
						this.players[d].x-=6;
					}
				}
				if(this.players[d]["d"][87]||this.players[d]["d"][38]){
					if(this.mazes[this.players[d]["m"]][~~((this.players[d].y-7)/64)][~~((x)/64)]!=0){
						this.players[d].y-=6;
					}
				}
				if(this.players[d]["d"][68]||this.players[d]["d"][39]){
					if(this.mazes[this.players[d]["m"]][~~((this.players[d].y)/64)][~~((x+7)/64)]!=0){
						this.players[d].x+=6;
					}
				}
				if(this.players[d]["d"][83]||this.players[d]["d"][40]){
					if(this.mazes[this.players[d]["m"]][~~((this.players[d].y+7)/64)][~~((x)/64)]!=0){
						this.players[d].y+=6;
					}
				}
			}
		}
	};
	this.onChatMessage = function(pID,message,chatType){
		Pl = this.players[pID];
		for(var a=0;a<this.questions[Pl["m"]][1].length;a++){
			console.log("Checking '"+message.toLowerCase().replace(/ /g,"")+"' vs '"+this.questions[Pl["m"]][1][a]  + "' ,"+ Pl["f"])
			if(message.toLowerCase().replace(/ /g,"")==this.questions[Pl["m"]][1][a]){
				if(Pl["f"]=="t"){
					if(Pl["m"]+1==this.mazes.length){
						Pl["t"][this.mazes.length] = new Date().getTime()-Pl["t"]["started"];
						Pl.sendChatMessage("You win! Your time is : "+(Pl["t"][this.mazes.length]/1000)+" Seconds.");
					}else{
						Pl["t"][Pl["m"]] = new Date().getTime()-Pl["t"]["started"]-(Pl["m"]!=0&&Pl["t"][Pl["m"]-1]?Pl["t"][Pl["m"]-1]:0);
						Pl.sendChatMessage("You completed this level in "+(Pl["t"][Pl["m"]]/1000)+" Seconds! On to the next one!");
						Pl.x=this.mazeStartPos[Pl["m"]+1][1];
						Pl.y=this.mazeStartPos[Pl["m"]+1][0];
						console.log(Pl.x+","+Pl.y+","+Pl["m"]);
						Pl["m"]++;
					}
				}
				return;
			}
		}
		//Watch for answers. If player answers correctly put them into next maze.
		if(message.substring(0,1)==="/"){
			cH.handleP(this.players[pID],message);
		}else{
			if(Pl["f"]!="f")return;
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
		this.players[pID]["d"][keyCode]=true;
	}
	this.onKeyUp = function(pID,keyCode){
		this.players[pID]["d"][keyCode]=false;
	}
	this.onDrawScoreBoard = function(Pl,xoff,yoff){return "~";};
	this.getOffset = function(Pl){return [-1,-1];};
}
module.exports=fmaze;