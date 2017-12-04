var encodeToken;
var postData;
var limit = 3*4;
var isLoaded = false;
var pages = ["ngamgaiTay", "ngamgaiA", "sep.aiesec.hcmc"];
var curPage = pages[0];

function getTokenCookie() {
	var cookie = document.cookie;
	cookie = cookie.split("encodeToken=");
	if (cookie[1]) return cookie[1];
	
	return null;
}

async function getToken() {
	let cookie_token = getTokenCookie();
	if (cookie_token) return cookie_token;

	let encodeAppID = "MTUxNDEzNTQ1NDc1NjYy";
	let encodeSecretID = "ZjNkYjU4MDcxNTFjMjVjMzUyMWNjNmE5OTNjYTkyOWU";

	let url = "https://graph.facebook.com/oauth/access_token?";
	let result = await fetch(url + "client_id=" + atob(encodeAppID)
								+ "&client_secret=" + atob(encodeSecretID)
								+ "&grant_type=client_credentials"); 
	let json = await result.json();
	json = btoa(json.access_token);
	document.cookie = "encodeToken="+json+";";
	return json;
}

async function getPostFromPage(url) {
	let isFirstGet = false;
	if (url === "undefined") isFirstGet = true;
	if (isFirstGet) url = "https://graph.facebook.com/v2.10/"
							+ curPage
							+"?access_token="+atob(encodeToken)
							+"&fields=posts.limit("+limit+"){message"
											+",permalink_url"
											+",picture" //to load fast first
											+",full_picture"
											+",likes.summary(true).limit(0)"
											+",shares"
											+",source"
											+"}";
	let result = await fetch(url);
	let json = await result.json();

	if (isFirstGet) return json.posts;
	return json;	
}

function nextAllHide(selec) {
	$(selec).remove();
}

function createVideo(url) {
	var video_wrap = $("<div/>").addClass("post-video")
								.attr("is-play", 0);

	var video = $("<video/>").attr("src",url)
								.addClass("not-play-yet")
								.attr("loop","1")
								.appendTo(video_wrap);
	var play_button = $("<div/>")
							.addClass("post-video-playbutton")
							.appendTo(video_wrap);

	video_wrap.on("click", function() {
		$(this).find(".not-play-yet").removeClass("not-play-yet");
		$(this).css("background-color","#000");
		var video = $(this).find("video").get(0);
		if (video.paused) {
			video.play();
			$(this).attr("is-play", 1);
		}
		else{
			video.pause();
			$(this).attr("is-play", 0);
		}
	});

	return video_wrap;
}

function createPost(data) {
	var wrap = $("<div/>").addClass("post")
							.attr("id", data.id);
	var wrap_link = $("<div/>")
						.appendTo(wrap);
	var picture_wrap = $("<div/>").addClass("post-img")
								.appendTo(wrap_link);
	var picture = $("<img/>").attr("src",data.picture)
							.addClass("pic")
							.appendTo(picture_wrap);
	var full_picture = $("<img/>").attr("src", data.full_picture)
								.addClass("pic-full")
								.attr("onload", "nextAllHide('#"+data.id+" .pic')")
								.appendTo(picture_wrap);

	if (data.source) {
		var video = createVideo(data.source);
		video.appendTo(picture_wrap);
	}


	var social = $("<a/>")
						.attr("target","_blank")
						.attr("title", data.permalink_url)
						.attr("href", data.permalink_url)
						.addClass("post-social")
						.appendTo(wrap_link);

	var likes = $("<div/>").addClass("post-social-likes")
							.html(data.likes.summary.total_count)
							.appendTo(social);

	let share_count = 0;
	if (data.shares) share_count = data.shares.count;
	var shares = $("<div/>").addClass("post-social-shares")
							.html(share_count)
							.appendTo(social);

	var message = $("<div/>")
						.addClass("post-mes")
						.appendTo(wrap_link);
	if (data.message)
		data.message.split("\n").forEach((val)=>{
			var ins_reg = /(@(.*))|(instagram.com\/(.*))/gi;
			var url_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
			
			if (val.match(url_reg))
				val = val.replace(url_reg, 
				"<a href=\"$&\" title=\"$&\" target=\"_blank\">$&</a>");
			else if (val.match(ins_reg))
				val = val.replace(ins_reg, 
				"<a href=\"https://www.instagram.com/$2$4\" title=\"$&\" target=\"_blank\">$&</a>");
			
			
			$("<p/>").html(val).appendTo(message);
		});
	
	return wrap;
}

async function loadPost(where) {
	doStatus("hide");

	console.log("getting posts");
	postData = await getPostFromPage(where);
	console.log("	posts got");

	postData.data.forEach((data)=>{
		var p = createPost(data);
		$("#content").append(p);
	});
	doStatus("show");
}

$(document).one("DOMContentLoaded", async()=> {
	createPageTabToNavbar();
	$(".page-tab").eq(0).addClass("page-tab-choose");
	doStatus("hide");
	console.log("getting token");
	encodeToken = await getToken();
	console.log("	token got");
	await loadPost("undefined");
});

$("#see-more").click(async()=>{
	// doStatus("hide");

	// postData = await getPostFromPage(postData.paging.next);
	// postData.data.forEach((data)=>{
	// 	var p = createPost(data);
	// 	$("#content").append(p);
	// });

	// doStatus("show");

	loadPost(postData.paging.next);
});

function doStatus(statement) {
	if (statement === "show") {
		$("#see-more").fadeIn(100);
		$("#load-icon").fadeOut(100);

	} else if (statement === "hide") {
		$("#see-more").fadeOut(100);
		$("#load-icon").fadeIn(100);
	}
}

var lastScrollTop = $(window).scrollTop();
$(window).scroll(function() {
	let cur_scrollTop = $(this).scrollTop();
	if (cur_scrollTop <= lastScrollTop) {
		$("#navbar").css("top", "0");
	}
	else {
		$("#navbar").css("top", "-50px");
	}
	lastScrollTop = cur_scrollTop;
});
$(window).scroll(function() {
    if (!isLoaded 
        && $(window).scrollTop()+$(window).height() >= $(document).height()-10)
    {
    	isLoaded = true;
    	loadPost(postData.paging.next).then(function() {
    		isLoaded = false;
    	});
    }
 });

async function createPageTabToNavbar() {
	var navbar = $("#navbar")
	pages.forEach((val)=>{
		$("<div/>").addClass("page-tab")
					.html(val)
					.appendTo(navbar);
	});

	$(".page-tab").click(async function(){
		if (isLoaded) return;
		isLoaded = true;
		$(".page-tab").removeClass("page-tab-choose");
		$(this).addClass("page-tab-choose");
		$("#content").html("");
		curPage = $(this).html();
		await loadPost("undefined");
		isLoaded = false;
	});
}