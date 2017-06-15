$(document).ready(function(){
	$(".social-info a").attr('target','_blank');
	$("#side-bar a").hide();
	$('#side-bar-hover').on('click',function() {
		$('#side-bar a').slideToggle(500);
	});

	///when mouse over the info-mem
	$('.info-mem').hover(function(){
		$(this).find('.info-toggle').slideDown(500);
		$(this).find('.nienkhoa').css('border-color','#115');
	}, function() {
		$(this).find('.info-toggle').slideUp(500);
		$(this).find('.nienkhoa').css('border-color','#88f');
	});

	/// smooth scrolling
	var page = $('html, body');
	$('#side-bar a').click(function() {
		page.animate({
			scrollTop: $($(this).attr('href')).offset().top
		}, 1000);
		$('#side-bar-hover').click();
	});
});