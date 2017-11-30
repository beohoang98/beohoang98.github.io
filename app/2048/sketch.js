var numArr = Array(16);

var N = 4;

function setup() {
	createCanvas(400, 500);
	background(200);
	frameRate(30);
	noStroke();
	textSize(50);
	for (var i = 0; i < N; ++i) {
		for (var j = 0; j < N; ++j) {
			numArr[j*N+i] = new Number(i, j, 0);
		}
	}
	randomNum();
}

function draw() {
	drawBG();
	drawNum();
}

function drawBG() {
	fill(128);
	
	for (var i = 0; i < N; ++i) {
		for (var j = 0; j < N; ++j) {
			rect(5 + i*(94+5), 5+ j*(94+5), 94, 94);
		}
	}
	fill(100);
	rect(5, 400, 400-10, 100-5);
}

function drawNum() {
	numArr.forEach((val, i)=>{
		if (numArr[i].num !== 0)
			numArr[i].show();
	});
}

function isGameOver() {
	for (var i = 0; i < N*N; ++i) {
		if (numArr[i].num === 0) return false;
	}
	return true;
}

function gameOver() {
	document.querySelector("#game-over-scene").style.opacity = "1";
	console.log('game over');
}

function randomNum() {
	if (isGameOver()) {
		gameOver();
		return;
	}
	var vitri = Math.floor(Math.random()*16);
	while (numArr[vitri].num > 0) {
		vitri = Math.floor(Math.random()*16);
		console.log("random");
	}
	numArr[vitri].num = 2;
}

function keyPressed() {
	if (keyCode == RIGHT_ARROW) {
		plusByDirection(2);
		console.log("right");
		randomNum();
	}
	else if (keyCode == LEFT_ARROW) {
		plusByDirection(4);
		console.log("left");
		randomNum();
	}
	else if (keyCode == UP_ARROW) {
		plusByDirection(1);
		console.log("up");
		randomNum();
	}
	else if (keyCode == DOWN_ARROW) {
		plusByDirection(3);
		console.log("down");
		randomNum();
	}

	// console.log("pressed");
}

// 1 = up
// 2 = right
// 3 = down
// 4 = left
function plusByDirection(direction) {
	switch(direction) {
		case 1: plusUp(); break;
		case 2: plusRight(); break;
		case 3: plusDown(); break;
		case 4: plusLeft(); break;
	}
}

function plusRight() {
	for (var j = 0; j < N; ++j) {
		let i = N-1;
		let i_next = i-1;
		while (i > 0) {
			while (i_next >= 0 && numArr[j*N + i_next].num ===0)
				--i_next;
			if (i_next < 0) break;
			if (numArr[j*N + i_next].num === numArr[j*N + i].num)
			{
				let tmp = numArr[j*N + i_next].num;
				numArr[j*N + i_next].num = 0;
				numArr[j*N + i].num += tmp;
				--i;
			}
			else {
				if (numArr[j*N + i].num === 0) {
					let tmp = numArr[j*N + i_next].num;
					numArr[j*N + i_next].num = 0;
					numArr[j*N + i].num = tmp;
				}
				else {
					if (i_next !== i-1) {
						let tmp = numArr[j*N + i_next].num;
						numArr[j*N + i_next].num = 0;
						numArr[j*N + i - 1].num = tmp;	
					}
					--i;
					--i_next;
				}
			}
		}
	}
}
function plusLeft() {
	for (var j = 0; j < N; ++j) {
		let i = 0;
		let i_next = i+1;
		while (i < N-1) {
			while (i_next < N && numArr[j*N + i_next].num ===0)
				++i_next;
			if (i_next >= N) break;
			if (numArr[j*N + i_next].num === numArr[j*N + i].num)
			{
				let tmp = numArr[j*N + i_next].num;
				numArr[j*N + i_next].num = 0;
				numArr[j*N + i].num += tmp;
				++i;
			}
			else {
				if (numArr[j*N + i].num === 0) {
					let tmp = numArr[j*N + i_next].num;
					numArr[j*N + i_next].num = 0;
					numArr[j*N + i].num = tmp;
				}
				else {
					if (i_next !== i+1) {
						let tmp = numArr[j*N + i_next].num;
						numArr[j*N + i_next].num = 0;
						numArr[j*N + i + 1].num = tmp;	
					}
					++i;
					++i_next;
				}
			}
		}
	}
}
function plusDown() {
	for (var j = 0; j < N; ++j) {
		let i = N-1;
		let i_next = i-1;
		while (i > 0) {
			while (i_next >= 0 && numArr[j + i_next*N].num ===0)
				--i_next;
			if (i_next < 0) break;
			if (numArr[j + i_next*N].num === numArr[j + i*N].num)
			{
				let tmp = numArr[j + i_next*N].num;
				numArr[j + i_next*N].num = 0;
				numArr[j + i*N].num += tmp;
				--i;
			}
			else {
				if (numArr[j + i*N].num === 0) {
					let tmp = numArr[j + i_next*N].num;
					numArr[j + i_next*N].num = 0;
					numArr[j + i*N].num = tmp;
				}
				else {
					if (i_next !== i-1) {
						let tmp = numArr[j + i_next*N].num;
						numArr[j + i_next*N].num = 0;
						numArr[j + (i - 1)*N].num = tmp;
					}
					--i;
					--i_next;
				}
			}
		}
	}
}
function plusUp() {
	for (var j = 0; j < N; ++j) {
		let i = 0;
		let i_next = i+1;
		while (i < N-1) {
			while (i_next < N && numArr[j + i_next*N].num ===0)
				++i_next;
			if (i_next >= N) break;
			if (numArr[j + i_next*N].num === numArr[j + i*N].num)
			{
				let tmp = numArr[j + i_next*N].num;
				numArr[j + i_next*N].num = 0;
				numArr[j + i*N].num += tmp;
				++i;
			}
			else {
				if (numArr[j + i*N].num === 0) {
					let tmp = numArr[j + i_next*N].num;
					numArr[j + i_next*N].num = 0;
					numArr[j + i*N].num = tmp;
				}
				else {
					if (i_next !== i+1) {
						let tmp = numArr[j + i_next*N].num;
						numArr[j + i_next*N].num = 0;
						numArr[j + (i + 1)*N].num = tmp;
					}
					++i;
					++i_next;
				}
			}
		}
	}
}