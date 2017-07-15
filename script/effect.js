$(document).ready(function(){
	$(".social-info a").attr('target','_blank');

	///when mouse over the info-mem
	$('.info-mem').hover(function(){
		$(this).find('.info-toggle').slideDown(500);
		$(this).find('.nienkhoa').css('border-color','#55f');
	}, function() {
		$(this).find('.info-toggle').slideUp(500);
		$(this).find('.nienkhoa').css('border-color','#555');
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
