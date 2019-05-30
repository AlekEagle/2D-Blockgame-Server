var gs = require("./game.js");
var GT = require("./Games.js");
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();
String.prototype.startsWith = function(str){
	return this.substring(0,str.length).toLowerCase()===str.toLowerCase();
}
function handle(data){
	data = data.replace("\n","");
	if(data.startsWith("Players")){
		var args = data.split(" ");
		if(args.length==1){
			try {
				console.log("PID |   IP Address   | "+fillChar("UserName"," ",gs.config.maxUserLength)+"| x-pos | y-pos | Game ID | Ping");
				for(var i=0;i<gs.players.length;i++){
					if(gs.players[i]){
						try{
							console.log(fillChar(i," ",4)+"| "+fillChar(gs.players[i].ws._socket.remoteAddress," ",15)+"| "+fillChar(gs.players[i].name," ",gs.config.maxUserLength)+"|"+fillChar(" "+gs.players[i].x," ",7)+"|"+fillChar(" "+gs.players[i].y," ",7)+"| "+fillChar(gs.players[i].curGame," ",10)+"| "+gs.players[i].getPing()+"ms");
						}catch(err){
							try{
								console.log(fillChar(i," ",4)+"| "+fillChar("NULL"," ",15)+"| "+fillChar(gs.players[i].name," ",gs.config.maxUserLength)+"|"+fillChar(" "+gs.players[i].x," ",7)+"|"+fillChar(" "+gs.players[i].y," ",7)+"| "+fillChar(gs.players[i].curGame," ",10)+"| "+gs.players[i].getPing()+"ms");
							}catch(err2){
								console.log(fillChar(i," ",4)+"| "+fillChar("NULL"," ",15)+"| "+fillChar(gs.players[i].name," ",gs.config.maxUserLength)+"|"+fillChar(" "+gs.players[i].x," ",7)+"|"+fillChar(" "+gs.players[i].y," ",7)+"| "+fillChar(gs.players[i].curGame," ",10)+"| -1ms");
							}
						}
					}
				}
			}catch(err){
				console.log("Could not list players: "+err.message);
			}
		}else{
			if(gs.games[parseInt(args[1])]){
			try {
				console.log("PID |   IP Address   | "+fillChar("UserName"," ",gs.config.maxUserLength)+"| x-pos | y-pos | Game ID");
				for(var i=0;i<gs.games[parseInt(args[1])].gs.players.length;i++){
					if(gs.games[parseInt(args[1])].gs.players[i]){
						console.log(fillChar(i," ",4)+"| "+fillChar(gs.games[parseInt(args[1])].gs.players[i].ws._socket.remoteAddress," ",15)+"| "+fillChar(gs.games[parseInt(args[1])].gs.players[i].name," ",gs.config.maxUserLength)+"|"+fillChar(" "+gs.games[parseInt(args[1])].gs.players[i].x," ",7)+"|"+fillChar(" "+gs.games[parseInt(args[1])].gs.players[i].y," ",7)+"| "+fillChar(gs.games[parseInt(args[1])].gs.players[i].curGame," ",10)+"| "+gs.players[i].getPing()+"ms");
					}
				}
			}catch(err){
				console.log("Could not list players in game: "+err.message);
			}
			}else{
				console.log("Game "+parseInt(args[1])+" does not exist");
			}
		}

	}else if(data.startsWith("count")){
		onlinePlayers=0;
		for(var i=0;i<gs.games.length;i++){
			if(gs.games[i]){
				onlinePlayers+=gs.games[i].playerCount;
			}
		}
		console.log("There are "+onlinePlayers+" players online");
	}else if(data.startsWith("kick")){
		var args = data.split(" ");
		if(args.length<2||(typeof parseInt(args[1]) == "undefined")||(parseInt(args[1]) == "NaN")){
			console.log("Please enter the ID of a player to kick");
			return;
		}
		if(!gs.players[parseInt(args[1])]){
			console.log("That player is not online.");
			return;
		}else{
			if(gs.players[parseInt(args[1])]){
				console.log("Player "+gs.players[parseInt(args[1])].name+"("+parseInt(args[1])+") was kicked");
				gs.players[parseInt(args[1])].ws.send('5|You have been kicked by an Administrator.');
				gs.players[parseInt(args[1])].ws.close();
				if(gs.games[gs.players[parseInt(args[1])].curGame])
					gs.games[gs.players[parseInt(args[1])].curGame].delPlayer(gs.players[parseInt(args[1])]);
				gs.rFA(gs.players,parseInt(args[1]));
			}
		}
	}else if(data.startsWith("tps")){
		console.log("Current TPS is "+gs.tps());
	}else if(data.startsWith("games")){
		console.log("GID | PlayerCount |    Game Name (Creator)    | GameType | isMainLobby | Closing In");
		for(var i=0;i<gs.games.length;i++){
			if(gs.games[i]){
				var gameStatus = gs.games[i].isMainLobby?(gs.games[i].playerCount==0?(Math.round((gs.games[i].ticksBeforeclose-gs.games[i].emptyTicks)/gs.config.desiredTPS)+" Seconds"):"Not Empty"):"Main Lobby Never Closes";
				console.log(fillChar(gs.games[i].gID," ",4)+"| "+fillChar(gs.games[i].playerCount+"/"+gs.games[i].playerCap," ",12)+"| "+fillChar(gs.games[i].GameName+" (C:"+gs.games[i].creator+")"," ",26)+"| "+fillChar(gs.games[i].GameType," ",9)+"| "+fillChar(!gs.games[i].isMainLobby+""," ",12)+"| "+fillChar(gameStatus," ",12));
			}
		}
	}else if(data.startsWith("tpto")){
		var args = data.split(" ");
		if(args.length<2||(typeof parseInt(args[1]) == "undefined")||(parseInt(args[1]) == "NaN")){
			console.log("Please enter the ID of a player to teleport.");
			return;
		}
		if(args.length<3||(typeof parseInt(args[2]) == "undefined")||(parseInt(args[2]) == "NaN")){
			console.log("Please enter the ID of a player to teleport to.");
			return;
		}
		if(!gs.players[parseInt(args[1])]){
			console.log("player "+parseInt(args[1])+" isnt online.");
			return;
		}
		if(!gs.players[parseInt(args[2])]){
			console.log("player "+parseInt(args[2])+" isnt online.");
			return;
		}
		if(gs.players[parseInt(args[1])].curGame != gs.players[parseInt(args[2])].curGame){
			if(gs.games[gs.players[parseInt(args[2])].curGame].playerCount < gs.games[gs.players[parseInt(args[2])].curGame].playerCap){
				gs.players[parseInt(args[1])].joinGame(gs.players[parseInt(args[2])].curGame);
			}else{
				console.log("That player's game is full, use /ftpto instead");
			}
		}
		gs.players[parseInt(args[1])].x = gs.players[parseInt(args[2])].x;
		gs.players[parseInt(args[1])].y = gs.players[parseInt(args[2])].y;
		console.log("Player "+gs.players[parseInt(args[1])].name+"("+parseInt(args[1])+") Teleported to "+gs.players[parseInt(args[2])].name+"("+parseInt(args[2])+")");
	}else if(data.startsWith("ftpto")){
		var args = data.split(" ");
		if(args.length<2||(typeof parseInt(args[1]) == "undefined")||(parseInt(args[1]) == "NaN")){
			console.log("Please enter the ID of a player to teleport.");
			return;
		}
		if(args.length<3||(typeof parseInt(args[2]) == "undefined")||(parseInt(args[2]) == "NaN")){
			console.log("Please enter the ID of a player to teleport to.");
			return;
		}
		if(!gs.players[parseInt(args[1])]){
			console.log("player "+parseInt(args[1])+" isnt online.");
			return;
		}
		if(!gs.players[parseInt(args[2])]){
			console.log("player "+parseInt(args[2])+" isnt online.");
			return;
		}
		if(gs.players[parseInt(args[1])].curGame != gs.players[parseInt(args[2])].curGame){
			gs.players[parseInt(args[1])].fjoinGame(gs.players[parseInt(args[2])].curGame);
		}
		gs.players[parseInt(args[1])].x = gs.players[parseInt(args[2])].x;
		gs.players[parseInt(args[1])].y = gs.players[parseInt(args[2])].y;
		console.log("Player "+gs.players[parseInt(args[1])].name+"("+parseInt(args[1])+") Teleported to "+gs.players[parseInt(args[2])].name+"("+parseInt(args[2])+")");
	}else if(data.startsWith("tppos")){
		var args = data.split(" ");
		if(args.length<2||(typeof parseInt(args[1]) == "undefined")||(parseInt(args[1]) == "NaN")){
			console.log("Please enter the ID of a player to teleport.");
			return;
		}
		if(args.length<4||(typeof parseInt(args[2]) == "undefined")||(typeof parseInt(args[3]) == "undefined")){
			console.log("USAGE : tppos <playerID> <x> <y> (gameID)");
			return;
		}
		if(!gs.players[parseInt(args[1])]){
			console.log("player "+parseInt(args[1])+" isnt online.");
			return;
		}
		if((args.length==5)&&(typeof parseInt(args[4]) != "undefined")){
			if(gs.games[parseInt(args[4])]){
				if(gs.players[parseInt(args[1])].curGame != parseInt(args[4])){
					if(gs.games[parseInt(args[4])].playerCount < gs.games[parseInt(args[4])].playerCap){
						gs.players[parseInt(args[1])].joinGame(parseInt(args[4]));
					}
				}
				console.log("Player "+gs.players[parseInt(args[1])].name+"("+parseInt(args[1])+") Teleported to ("+parseInt(args[2])+","+parseInt(args[3])+") In "+parseInt(args[4]));
			}else{
				console.log("Game "+parseInt(args[4])+" does not exist.");
				return;
			}
		}else{
			console.log("Player "+gs.players[parseInt(args[1])].name+"("+parseInt(args[1])+") Teleported to ("+parseInt(args[2])+","+parseInt(args[3])+") In "+gs.players[parseInt(args[1])].curGame+"");
		}
		gs.players[parseInt(args[1])].x = parseInt(args[2]);
		gs.players[parseInt(args[1])].y = parseInt(args[3]);
	}else if (data.startsWith('q') || data.startsWith('quit') || data.startsWith('stop')) {
		gs.players.forEach(p => {
			p.send('5|Server is closing');
			p.ws.close();
		});
		process.exit();
	}else {
		console.log("That command does not exist");
	}
}
var fillChar = function(data, char, fieldLength, rTL) {
    var result = data.toString();
    if (rTL === true) {
        for (var i = result.length; i < fieldLength; i++)
            result = char.concat(result);
    }
    else {
        for (var i = result.length; i < fieldLength; i++)
            result = result.concat(char);
    }
    return result;
};

function handleP(Pl,msg){
	command = msg.split(" ")[0];
	if(command==="/adminroom"){
		if(Pl.name.toLowerCase()=="alekeagle")
			Pl.createGame(new GT.adminRoom(Pl.id+" AR"));
	}
	else if(command==="/lobby"){
		Pl.joinGame(gs.getLobbyID());
	}else if(command==="/color"||command==="/colour"){
		if(msg.split(" ").length!=2){
			Pl.sendChatMessage("Usage of Color : /color #ff2d61");
		}else{
			if(msg.split(" ")[1].indexOf("#")==-1){
				Pl.sendChatMessage("Usage of Color : /color #ff2d61");
			}else{
				if(msg.split(" ")[1].length!=4&&msg.split(" ")[1].length!=7){
					Pl.sendChatMessage("Usage of Color : /color #ff2d61");
					return;
				}
				doit=false;
				try{
					parseInt(msg.split(" ")[1].replace(/#/gi,""),16);
					doit=true;
				}catch(e){Pl.sendChatMessage("Make sure you actually send a hexadecimal format.");}
				if(doit){
					Pl.color=msg.split(" ")[1];
					Pl.sendChatMessage("Your color has been set to "+msg.split(" ")[1]);
				}
			}
		}
	}else {
		Pl.sendChatMessage('Command not found.')
	}
}
exports.handle = handle;
exports.handleP = handleP;