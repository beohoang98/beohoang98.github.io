function createCheckTab(fbID) {
	var label = $("<label/>").attr("name", fbID);
	var wrap = $("<div/>").addClass("check-tab")
							.attr("id", fbID)
							.appendTo(label);
	var picture = $("<div/>").addClass("check-tab-pic")
								.appendTo(wrap);
	var img = $("<img/>").appendTo(picture);
	var name = $("<div/>").addClass("check-tab-name")
						.appendTo(wrap);
	var id_link = $("<div/>").addClass("check-tab-link")
						.appendTo(wrap);
	var link = $("<a/>").attr("href", "https://www.facebook.com/"+fbID)
						.attr("target", "_blank")
						.html(fbID)
						.appendTo(id_link);
	var check_wrap = $("<div/>").addClass("check-tab-check")
								.appendTo(wrap);
	var check_button = $("<input/>").addClass("check-button")
								.attr("type", "checkbox")
								.attr("name", "id[]")
								.attr("value", fbID)
								.appendTo(check_wrap);

	return label; 
}

function getDataSended(token) {
	console.log("getting data");
	$.ajax({
		url: "https:/beohoang98.herokuapp.com/hotgirl/data_send.txt",
		success: function(res) {
			var data = res.split("\r\n");
			data.forEach((val)=>{
				if (!val) return;
				let tab = createCheckTab(val);
				$("#content").append(tab.clone(true));
				syncDataFromFB(val, token);
			});
		},
		error: function() {
			console.log("get data error");
		}
	}).done(function() {
		console.log("done");
	});
}

async function getToken() {
	let encodeAppID = "MTUxNDEzNTQ1NDc1NjYy";
	let encodeSecretID = "ZjNkYjU4MDcxNTFjMjVjMzUyMWNjNmE5OTNjYTkyOWU";

	let url = "https://graph.facebook.com/oauth/access_token?";
	let result = await fetch(url + "client_id=" + atob(encodeAppID)
								+ "&client_secret=" + atob(encodeSecretID)
								+ "&grant_type=client_credentials"); 
	let json = await result.json();
	return btoa(json.access_token);
}

function syncDataFromFB(fbID, token) {
	$.ajax({
		url: "https://graph.facebook.com/"+fbID,
		method: "GET",
		data: {
			"access_token": atob(token),
			"fields":"name,picture.width(320)"
		},
		success: function(json) {
			console.log(json);
			$("#"+fbID+" img").attr("src", json.picture.data.url);
			$("#"+fbID+" .check-tab-name").html(json.name);
		},
		error: function() {
			console.log("can't get FB data");
		}
	});
}

$(document).on("DOMContentLoaded", async function() {
	console.log("getting token");
	var token = await getToken();
	if (atob(token)=="undefined") console.log("can't get token");
	else {
		console.log("token got");
		getDataSended(token);
	}
});