function createSkillTab(name, value, max, info) {
	let tab = $("<div/>").addClass("skill");
	let head = $("<div/>").addClass("skill-head");
		let head_name = $("<div/>").addClass("skill-name")
									.text(name);
		let head_point = $("<div/>").addClass("skill-diem").html(
			`<span>${value}</span>/${max}`
		);
		head.append(head_name).append(head_point);

	let body = $("<div/>").addClass("skill-info");
		body.append(info);

	tab.append(head).append(body);
	return tab;
}

$(document).ready(()=>{
	$("skill").each((i, val)=>{
		let name = $(val).attr("name");
		let value = $(val).attr("value");
		let max = $(val).attr("max");
		let info = $(val).children();
		var tab = createSkillTab(name, value, max, info);
		$(val).html(tab);
	});
});
