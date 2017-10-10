var numArr;

function setup() {
	createCanvas(400, 500);
	background(200);
	frameRate(30);
	noStroke();
	textSize(50);
	numArr = new Number(0,0,4);
}

function draw() {
	drawBG();
	numArr.show();
}

function drawBG() {
	fill(128);
	
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			rect(5 + i*(94+5), 5+ j*(94+5), 94, 94);
		}
	}
	fill(100);
	rect(5, 400, 400-10, 100-5);
}