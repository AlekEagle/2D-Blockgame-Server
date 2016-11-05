var GT = require("../Games.js");
var gs = require('../game.js');
function Snake(_gn,_gd){
	GT.GameMode.apply(this, Array.prototype.slice.call(arguments));
	this.GameType = 12;
	this.playerCap = _gd['C'];
	this.data=_gd;
}
module.exports=Snake;