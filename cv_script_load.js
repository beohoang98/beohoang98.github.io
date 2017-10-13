let oldDocScroll = 0;
$(window).on("scroll", function(){
	let docScroll = $(this).scrollTop();

	$(".info").each((i, val)=>{
		var nameTop = $(val).offset().top - docScroll;
		let itname = $(val).find(".info-name");
		if (nameTop <= 0) {
			itname.addClass("info-name-fixed");
		}
		else {
			itname.removeClass("info-name-fixed");
		}
	});
});


$(document).ready(function() {
	$(".project").each(function() {
		let url=$(this).attr("pic");
		$(this).css("background-image", "url(\""+url+"\")");
	});
});