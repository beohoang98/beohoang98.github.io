var pad = 5;
var w = (400-5*5)/4;

function Number(x, y, num) {
	this.x = x;
	this.y = y;
	this.num = num;

	this.show = function(){
		let rx = pad + this.x*(w+pad);
		let ry = pad + this.y*(w+pad);

		if (this.num <=4) fill(255);
		else if (this.num <= 16) fill(255,255,200);
		else if (this.num <= 64) fill(255,192,192);
		else if (this.num <= 128) fill(255, 100, 100);
		else fill(100, 255, 100);

		rect(rx, ry, w, w);
		let tw = textWidth(""+this.num);
		let th = 50;
		let tx = rx + (w-tw)/2;
		let ty = ry + (w-th)*3/2;
		fill(0);
		text(""+this.num, tx, ty);
	}
}