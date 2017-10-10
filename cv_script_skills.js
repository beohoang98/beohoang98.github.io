function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
    	el.setAttribute(k, attrs[k]);
	return el;
}

function createSkillTab(name, value, max) {
	let diem = value/max;
	let D = 240*3.1415926;
	let d = D-D*diem;

	var tab = $("<div/>").addClass("skill");
	var float_tab = $("<div/>").appendTo(tab);

	var diem_tab = $("<div/>").addClass("skill-diem");
	var diem_span = $("<span/>").html(value);
	diem_tab.html(diem_span)
			.append("/"+max);
	var name_tab = $("<div/>").addClass("skill-name")
							.html(name);

	var svg = makeSVG("svg", {
		x: "0px",
		y: "0px",
		viewBox: "0 0 300 300",
		"xml:space":"preserve"
	})
	var circle0 = makeSVG("circle", {
		class: "circle-0",
		cx: 150,
		cy: 150,
		r: 120
	});
	var circle1 = makeSVG("circle", {
		class: "circle-1",
		cx: 150,
		cy: 150,
		r: 120,
		"style": ("stroke-dashoffset: "+d
		          +";stroke-dasharray: "+D)
	});
	svg.appendChild(circle0);
	svg.appendChild(circle1);

	float_tab.append(diem_tab).append(name_tab);
	tab.append(svg);
	return tab;
}

$("skill").each((i, val)=>{
	let name = $(val).attr("name");
	let value = $(val).attr("value");
	let max = $(val).attr("max");
	var tab = createSkillTab(name, value, max);
	$(val).html(tab);
});