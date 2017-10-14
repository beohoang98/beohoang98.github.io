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

let scrollDistance = 200;
$(window).on("mousewheel DOMMouseScroll", function(event){
		event.preventDefault();	
										
		var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
		var scrollTop = $(window).scrollTop();
		var finalScroll = -parseInt(delta*scrollDistance);
		
		window.scrollBy({
			top: finalScroll,
			left: 0,
			behavior: "smooth"
		})
});