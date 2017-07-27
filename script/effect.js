$(document).ready(function(){
	//
	$('#side-bar-hover').on("click",function() {
		$(this).parent().find("a").toggleClass("show-a");
	});

	/// smooth scrolling
	var page = $('.container');
	$('#side-bar a').on("click",function(e) {
		page.animate({
			scrollTop: $($(this).attr('href')).offset().top - $('#header').offset().top
		}, 1000);
		$('#side-bar-hover').click();
	});

	$(".container").scroll(function() {
		checkOnView("#header");
		checkOnView("#about");
		checkOnView("#education");
		checkOnView("#skills");
		checkOnView("#pet-project");
	});
});

function checkOnView(IDView) {
	var hT = $(IDView).offset().top;
	var hW = $(IDView).outerHeight();
	if (100 <= hT+hW && hT < 100) {
		$("#side-bar a").removeClass("onView");
		$(IDView+"-a").addClass("onView");
	}
}
