$(".middle").hide();

let choose = [0, 0, 0, 0];
let ques;
let awID = -1;
let correctAnswer = 0;
let countAnswer = 0;
const maxAnswer = 100;

$("#next").on("click",nextQues);
$(document).on("keydown", (e)=>{
	if (e.keyCode==32) {
		nextQues();
	}
});

$("#answer li").on("click", (e)=>{
	let _this = e.target;
	if ($(_this).hasClass("block")) return;
	let aw = $(_this).text();
	if (ques == aw) { // use == to compare text and number
		$(_this).addClass("u-correct");
		$("#header-content").text("Correct");
		++correctAnswer;
	}
	else {
		$(_this).addClass("fail");
		$("#aw"+awID).addClass("m-correct");
		$("#header-content").text("Wrong");
	}
	$("#answer li").addClass("block");
});

let answer = {};
for (let i = 32; i < 127; ++i) {
	answer[i] = String.fromCharCode(i);
}

// console.log(answer);

function createNewQuestion() {
	$(".u-correct").removeClass("u-correct");
	$(".m-correct").removeClass("m-correct");
	$(".fail").removeClass("fail");
	$(".block").removeClass("block");

	//get random number
	for (let i = 0; i < 4; ++i) {
		let rand = Math.floor(Math.random()*(126-32)+32);
		while (choose.indexOf(rand) >= 0)
			rand = Math.floor(Math.random()*(126-32)+32);
		choose[i] = rand;
	}

	awID = Math.floor(Math.random()*4);
	ques = choose[awID];
	$("#question").html("Decimal of <span>"+ answer[ques] + "</span>");

	for (let i = 0; i < 4; ++i) {
		$("#aw"+i).text(choose[i]);
	}

	$("#point").text(""+correctAnswer);
	$("#count").text("/" + countAnswer);
	++countAnswer;
}

function nextQues() {
	$(".middle").fadeOut(500, ()=>{
		$("#next").text("Press space or click here to Next");
		createNewQuestion();
		$("#header-content").text("");
		$(".middle").fadeIn(500);
	});
}