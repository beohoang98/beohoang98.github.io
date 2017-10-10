let oldDocScroll = 0;
$(window).on("scroll", function(){
	let docScroll = $(this).scrollTop();
	let minTop = $("#content").offset().top - docScroll;
	if (minTop >= 100) {
		$("#navbar").removeClass("nav-fixed");
	} else {
		$("#navbar").addClass("nav-fixed");
	}
	oldDocScroll = docScroll;

	$(".info").each((i, val)=>{
		var nameTop = $(val).offset().top - docScroll;
		let itname = $(val).find(".info-name");
		if (nameTop <= 100) {
			itname.addClass("info-name-fixed");
		console.log("over");
		}
		else {
			itname.removeClass("info-name-fixed");
		}
	});
});