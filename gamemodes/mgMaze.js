var GT = require("../Games.js");
var gs = require('../game.js');
var cH = require("../commandhandler.js");
function maze(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 16;
	this.canJDuring=true;
	this.playerCap = _gd['C'];
	this.minX=-5000000005;this.minY=-50000000005;
	this.maxX=5000000005;this.maxY=50000000005;
	this.mazes=[]; 
	this.players=[];
	this.mazes[0] = randMaze(1);
	this.mazes[1] = randMaze(2);
	this.mazes[2] = randMaze(3);
	this.onConnect = function(Pl){
		this.players[Pl.id]=Pl;
		this.players[Pl.id]["m"]=0;
		this.players[Pl.id]["s"]="f";
		this.players[Pl.id]["v"]=[];
		this.players[Pl.id]["d"]=[];
		this.players[Pl.id]["f"]="f";
		this.players[Pl.id]["t"]=[];
		this.players[Pl.id]["p"]=[];
		this.players[Pl.id]["t"]["started"]=new Date().getTime();
		this.players[Pl.id].moveSpeed=0;
		if(!this.mazes[this.players[Pl.id]["m"]]){
			s=Math.ceil(4*Math.pow(Math.log(this.players[Pl.id]["m"]+1),4)+15);
			this.mazes[this.players[Pl.id]["m"]] = createMaze(s,s);
		}
		this.players[Pl.id].x=96;
		this.players[Pl.id].y=96;
	};
	this.onDisconnect = function(Pl){};
	this.onDraw = function(pID){
		var str = "~";var e=1;
		var Pl = this.players[pID];
		var offs=this.getOffset(Pl);
		var xoff=offs[0]; var yoff=offs[1];
		var Px=~~((Pl.x-5000*m)/64),Py=~~((Pl.y)/64);
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
					if(drawUs.indexOf(x2+"ยง"+y2)==-1)drawUs.push(x2+"ยง"+y2);
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
		if(this.players[pID]["p"][0]==Pl.x&&this.players[pID]["p"][1]==Pl.y){str=this.players[pID]["p"][2];}else{
		for(var v=0;v<drawUs.length;v++){
			if(drawUs[v]){
				x = drawUs[v].split("ยง")[0];y=drawUs[v].split("ยง")[1];
				if(this.mazes[m][y][x]==0)
					str += "3|1"+x+"0"+y+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|#000|#000ยง"+(5000*(m)+x*64+64)+"ยง"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==2)
					str += "3|1"+x+"0"+y+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|#0f0|#0f0ยง"+(5000*(m)+x*64+64)+"ยง"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==3){str += "3|1"+x+"0"+y+"|0|"+(5000*(m)+x*64)+"|"+(y*64)+"|#ff0|#000ยง"+(5000*(m)+x*64+64)+"ยง"+(y*64+64)+"~";}
			}
		} 
		for(var v=0;v<this.players[Pl.id]["v"].length;v++){
			if(this.players[Pl.id]["v"][v]&&drawUs.indexOf(this.players[Pl.id]["v"][v])==-1){
				x = this.players[Pl.id]["v"][v].split("ยง")[0];y=this.players[Pl.id]["v"][v].split("ยง")[1];
				str += "3|1"+x+"0"+y+"|9|0|0|0|0ยง0~";
			}
		}
		this.players[Pl.id]["v"]=drawUs;
		/*for(var y=0;y<this.mazes[m].length;y++){
			for(var x=0;x<this.mazes[m][y].length;x++){
				if(this.mazes[m][y][x]==0)
					str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#000"+"|#000ง"+(5000*(m)+x*64+64)+"ง"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==3)
					str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#0f0"+"|#0f0ง"+(5000*(m)+x*64+64)+"ง"+(y*64+64)+"~";
				if(this.mazes[m][y][x]==2){str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#ff99b3"+"|#000ง"+(5000*(m)+x*64+64)+"ง"+(y*64+64)+"~";str += "3|"+(e++)+"|1|"+(5000*(m)+x*64+32)+"|"+(y*64+32)+"|"+"#000"+"|?~";}
				if(this.mazes[m][y][x]==4){str += "3|"+(e++)+"|4|"+(5000*(m)+x*64)+"|"+(y*64)+"|"+"#ff0"+"|#000ง"+(5000*(m)+x*64+64)+"ง"+(y*64+64)+"~";}
			}
		}*/
		}
		this.players[pID]["p"][0]=Pl.x;this.players[pID]["p"][1]=Pl.y;this.players[pID]["p"][2]=str;
		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]&&d!=pID)
				if(this.players[d]["m"]==m){
					str += "3|"+(d+29900)+"|2|"+(this.players[d].x-5+xoff)+"|"+(this.players[d].y-5+yoff)+"|"+(drawPl.indexOf(d)!=-1?"#f00":"#fff")+"|"+(drawPl.indexOf(d)!=-1?"#000":"#fff")+"ยง"+(drawPl.indexOf(d)!=-1?this.players[d].name:"")+"~";
				} 
		}
		str += "3|"+(pID+29900)+"|2|"+(this.players[pID].x-5)+"|"+(this.players[pID].y-5)+"|#0ff|#ff5500ยง"+this.players[pID].name+"~";			

		return str;
	};
	this.onUpdate = function(Pl){};
	this.onTick = function(){
		for(var d = 0;d<this.players.length;d++){
			if(this.players[d]){
				if(!this.mazes[this.players[d]["m"]+1]){
					this.mazes[this.players[d]["m"]+1] = randMaze(this.players[d]["m"]+2);
				}
				x = ~~((this.players[d].x-5000*(this.players[d]["m"]))/64);
				y = ~~((this.players[d].y)/64);
				m = this.players[d]["m"];
					if(this.mazes[m][y][x]==2){
						if(this.players[d]["s"]=="f"){this.players[d].sendChatMessage("Find the exit!");this.players[d]["s"]="t";}
						if(this.players[d]["f"]=="t")this.players[d]["f"]="r";		
					}else if(this.mazes[m][y][x]==3){
						this.players[d]["t"][this.players[d]["m"]] = new Date().getTime()-this.players[d]["t"]["started"]-(this.players[d]["m"]!=0&&this.players[d]["t"][this.players[d]["m"]-1]?this.players[d]["t"][this.players[d]["m"]-1]:0);
						this.players[d].sendChatMessage("You completed this level in "+(this.players[d]["t"][this.players[d]["m"]]/1000)+" Seconds! On to the next one!");
						this.players[d].x=96+5000*(this.players[d]["m"]+1);
						this.players[d].y=96;
						console.log(this.players[d].x+","+this.players[d].y+","+this.players[d]["m"]);
						this.players[d]["m"]++;
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
	this.onKeyDown = function(pID,keyCode){
		this.players[pID]["d"][keyCode]=true;
	}
	this.onKeyUp = function(pID,keyCode){
		this.players[pID]["d"][keyCode]=false;
	}
	this.onDrawScoreBoard = function(Pl,xoff,yoff){return "~";};
	this.getOffset = function(Pl){return [-1,-1];};
}
function randMaze(l){
	console.log("Gen LVL : "+l);
	return createMaze(Math.ceil(4*Math.pow(Math.log10(l),4)+15),Math.ceil(4*Math.pow(Math.log10(l),4)+15));
}
function createMaze(mazeWidth,mazeHeight){
	var moves = [];
	var all=0,notwall=0;
	var maze = [];
	if(mazeWidth%2==0){mazeWidth+=1};
	if(mazeHeight%2==0){mazeHeight+=1};
	for(var i = 0; i < mazeHeight; i ++){
	   maze[i] = [];
	   for(var j = 0; j < mazeWidth; j ++){
			maze[i][j] = 0;
			all++;
	   }
	}
	var posX = 1;
	var posY = 1;
	maze[posX][posY] = 2; 
	moves.push(posY + posY * mazeWidth);
	var hasExit=false;
	while(moves.length){       
		var possibleDirections = "";
		if(posX+2 > 0 && posX + 2 < mazeHeight - 1 && maze[posX + 2][posY] == 0){
			 possibleDirections += "S";
		}
		if(posX-2 > 0 && posX - 2 < mazeHeight - 1 && maze[posX - 2][posY] == 0){
			 possibleDirections += "N";
		}
		if(posY-2 > 0 && posY - 2 < mazeWidth - 1 && maze[posX][posY - 2] == 0){
			 possibleDirections += "W";
		}
		if(posY+2 > 0 && posY + 2 < mazeWidth - 1 && maze[posX][posY + 2] == 0){
			 possibleDirections += "E";
		} 
		if(possibleDirections){
			 var move = Math.floor(Math.random() * (possibleDirections.length - 1 + 1));
			 genNext = hasExit?1:Math.random()>0.9?posX>=~~(mazeWidth/3*2)||posY>=~~(mazeHeight/3*2)?3:1:1;
			 if(genNext==3)hasExit=true;
			 switch (possibleDirections[move]){
				  case "N": 
					   maze[posX - 2][posY] = genNext;
					   maze[posX - 1][posY] = 1;
					   notwall+=2;
					   posX -= 2;
					   break;
				  case "S":
					   maze[posX + 2][posY] = genNext;
					   maze[posX + 1][posY] = 1;
					   notwall+=2;
					   posX += 2;
					   break;
				  case "W":
					   maze[posX][posY - 2] = genNext;
					   maze[posX][posY - 1] = 1;
					   notwall+=2;
					   posY -= 2;
					   break;
				  case "E":
					   maze[posX][posY + 2]=genNext;
					   maze[posX][posY + 1]=1;
					   notwall+=2;
					   posY += 2;
					   break;         
			 }
			 moves.push(posY + posX * mazeWidth);     
		}else{
			 var back = moves.pop();
			 posX = Math.floor(back / mazeWidth);
			 posY = back % mazeWidth;
		}                                     
	}     
	if(!hasExit){maze[mazeWidth-2][mazeHeight-2]="3";}
	return maze;
}
function fillSpaces(s,l,c){
	str = s;
	for(var a=str.length;a<=l&&str.length<=l;a++){
		str+=c;
	}
	return str;
}
module.exports=maze;