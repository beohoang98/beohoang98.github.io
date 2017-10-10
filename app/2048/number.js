var pad = 5;
var w = (400-5*5)/4;

function Number(x, y, num) {
	this.x = x;
	this.y = y;
	this.num = num;

	this.show = function(){
		let rx = pad + x*(w+pad);
		let ry = pad + y*(w+pad);
		fill(255);
		rect(rx, ry, w, w);
		let tw = textWidth(""+num);
		let th = 50;
		let tx = rx + (w-tw)/2;
		let ty = ry + (w-th)*3/2;
		fill(0);
		text(""+num, tx, ty);
	}
}