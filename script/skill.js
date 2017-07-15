$(document).ready(function(){


	var skill = $('skill');
	for (var i = 0; i < skill.length; ++i) {
		var rate = skill[i].getAttribute('rate');
		var name = skill[i].getAttribute('name');
		var maxRate = skill[i].getAttribute('max');
		if (!maxRate) maxRate=10;

		var d = $('<div class="skill-display"></div>');
		$('<p/>').text(name).appendTo(d);

		var d1 = $('<div/>').css('width', rate*100/maxRate+"%")
							.css('background','#55f');

		var d2 = $('<div/>').css('width', (maxRate-rate)*100/maxRate+"%")
							.css('background','#555');

		var sub = $('<p class="skill-sub"/>').text(rate+'/'+maxRate);

		d.append(sub).append(d1).append(d2);
		d.appendTo(skill[i]);
	}

	$('skill p').hover(function() {
		$(this).find('.skill-display').slideDown(400);
	}, function() {
		$(this).find('.skill-display').slideUp(400);
	})
});
