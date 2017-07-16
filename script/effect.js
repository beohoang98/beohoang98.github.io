$(document).ready(function(){
	$(".social-info a").attr('target','_blank');

	///when mouse over the info-mem
	$('.info-mem').hover(function(){
		$(this).find('.nienkhoa').css('border-color','#55f');
	}, function() {
		$(this).find('.nienkhoa').css('border-color','#555');
	});

	//
	$('#side-bar-hover').on("click",function() {
		$(this).parent().find("a").toggleClass("show-a");
	});

	/// smooth scrolling
	var page = $('.container');
	$('#side-bar a').click(function() {
		page.animate({
			scrollTop: $($(this).attr('href')).offset().top - $('#header').offset().top
		}, 1000);
		$('#side-bar-hover').click();
	});
});
