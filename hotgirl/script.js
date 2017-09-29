/**
 * 
 */

var limit = 10;
var offset = 0;
var arrID = [];
var token;

function addDataToWeb() {
	arrID.forEach((fbID, index)=>{
   		if (index<offset||index>offset+limit) return;
		var link = createLink(index, fbID);
		$("#content").append(link);
    	getAndCreateInfoTab(index, fbID, token);
	});
}

async function readTextFile(file)
{
   	await $.ajax({
   		url: file,
   		success: function(data) {
   			arrID = data.split("\n");
   			addDataToWeb(token);
   		}
   	});
}

function createLink(idPost, fbID) {
	var wrap = $("<div/>").addClass("link")
							.attr("id", idPost);
	var link = $("<a/>").attr("target","_blank")
						.attr("href","https://fb.com/"+fbID);
	var img = $("<img/>")
	
	link.append(img);
	wrap.append(link);
	return wrap;
};

function getAndCreateInfoTab(index, fbID, token) {
	$.ajax({
		url: "//graph.facebook.com/v2.10/"+fbID,
		async:false,
		data: {
			"access_token":token,
			fields:"id,name,picture.width(720),short_name"
		},
		success: function(data) {
			$("#"+index+" img").attr("src", data.picture.data.url);
			// console.log(data);
			var tab = createInfoTab(data);
			$("#"+index).append(tab);
			tab.focus();
		}
	});
}

function createInfoTab(data) {
	let url = "https://www.facebook.com/plugins/follow.php?href=https%3A%2F%2Fwww.facebook.com%2F"+data.id+"&width=150&layout=button_count&size=large&show_faces=true&appId=151413545475662"
	var wrap = $("<div/>").addClass("info-tab").attr("id", data.id);
	var tab = $("<div/>").appendTo(wrap);
	var name = $("<div/>").addClass("info-name")
							.html(data.name)
							.appendTo(tab);
	var shortname = $("<div/>").addClass("info-shortname")
							.html("("+data.short_name+")")
							.appendTo(tab);
	var follow_but = $("<iframe/>")
						.attr("src",url)
						.appendTo(tab);
	var photo = $("<div/>").addClass("info-photos");
	getUserPhotos(data.id);

	return wrap;
}

function getUserPhotos(fbID) {
	$.getJSON("//graph.facebook.com/"+fbID+"/photos?callback=?",{
		"access_token":token,
		"fields":"images"
	}, function(data) {
		var url = data.images[1].source;
		$("<img/>").css("width","50px")
					.attr("src",url)
					.appendTo($("#"+id+" .info-photos"));
	});
}

$(document).on("DOMContentLoaded", async()=>{
	token = await getAccessToken();
	await readTextFile("data.txt");
	document.removeEventListener("DOMContentLoaded", function() {});
	console.log("LOADED");
});

async function getAccessToken() {
	var appID = "370804436672809";
	var secretID = "05f337c576c5bb8db5ecc61eeded390a";
	var rs = await fetch("//graph.facebook.com/oauth/access_token?client_id="+appID+"&client_secret="+secretID+"&grant_type=client_credentials");
	var token = await rs.json();
	return token.access_token;
}

$("#load-more").on("click",()=>{
	offset+=10;
	addDataToWeb();
});