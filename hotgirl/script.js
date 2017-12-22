/**
 *
 */

var limit = 25;
var offset = 0;
var arrID = [];
var token;
var offset_display = 0;

var thisDomain = "https://beohoang98.herokuapp.com/hotgirl/";

function addDataToWeb() {
    for (var index = offset; index < limit + offset; ++index) {
        if (index >= arrID.length) break;
        var link = createLink(index, arrID[index]);
        $("#content").append(link);
        getAndCreateInfoTab(index, arrID[index], token);
    }
}

async function readTextFile(file) {
    await $.ajax({
        url: file,
        type: "GET",
        success: function(data) {
            arrID = data.data;
            addDataToWeb(token);
        }
    });
}

function createLink(idPost, fbID) {
    var wrap = $("<div/>").addClass("link link-hide")
        .attr("id", idPost);
    var link = $("<a/>").attr("target", "_blank")
        .attr("href", "https://www.facebook.com/" + fbID);
    var img = $("<img/>")

    link.append(img);
    wrap.append(link);
    return wrap;
};

function getAndCreateInfoTab(index, fbID, token) {
    $.ajax({
        url: "https://graph.facebook.com/v2.10/" + fbID,
        data: {
            "access_token": token,
            fields: "id,name,picture.width(320)"
        },
        success: function(data) {
            $("#" + index + " img").attr("src", data.picture.data.url);
            //
            ++offset_display;
            $("#pages").html(offset_display + "/" + arrID.length);
            // console.log(data);
            var tab = createInfoTab(data);
            $("#" + index).append(tab);
        },
        error: function() {
            console.log("error " + fbID + ".");
            $("#" + index).remove();
            $.ajax({
                url: thisDomain + "review/remove.php",
                method: "POST",
                data: {
                    "id\[\]": fbID
                },
            });
        }
    });
}

function createInfoTab(FBdata) {
    let url = "https://www.facebook.com/plugins/follow.php?href=https%3A%2F%2Fwww.facebook.com%2F" + FBdata.id + "&width=150&layout=button_count&size=large&show_faces=true&appId=151413545475662"
    var wrap = $("<div/>").addClass("info-tab").attr("id", FBdata.id);
    var tab = $("<div/>");
    var name = $("<div/>").addClass("info-name")
        .html(FBdata.name);
    var follow_but = $("<iframe/>")
        .attr("src", url)
        .attr("frameborder", "0")
        .attr("scrolling", "no");
    var remove_but = $('<div/>')
        .addClass("remove-person")
        .text("X");

    remove_but.on("click", function() {
        $(this).parent().parent().parent().addClass("link-removed");
        $.ajax({
            url: thisDomain + "removeID.php",
            method: "POST",
            data: {
                "id": FBdata.id
            },
            success: () => {
                console.log("send remove success");
            },
            error: () => {
                console.log("send remove error");
            }
        });
    });
    tab.on("click", function() {
        $(".remove-show").removeClass("remove-show");
        $(this).find(".remove-person").addClass("remove-show");
    });

    tab.append(name)
        .append(follow_but)
        .append(remove_but);
    wrap.append(tab);

    return wrap;
}

// function getUserPhotos(fbID) {
// 	$.getJSON("//graph.facebook.com/"+fbID+"/photos?callback=?",{
// 		"access_token":token,
// 		"fields":"images"
// 	}, function(data) {
// 		var url = data.images[1].source;
// 		$("<img/>").css("width","50px")
// 					.attr("src",url)
// 					.appendTo($("#"+id+" .info-photos"));
// 	});
// }

$(document).on("DOMContentLoaded", async() => {
    token = await getAccessToken();
    await readTextFile(thisDomain + "testAPI.php");
    console.log("LOADED");
    $("#wait").remove();
    document.removeEventListener("DOMContentLoaded", function() {});
});

async function getAccessToken() {
    var appID = "151413545475662";
    var secretID = "f3db5807151c25c3521cc6a993ca929e";
    var rs = await fetch("https://graph.facebook.com/oauth/access_token?client_id=" + appID + "&client_secret=" + secretID + "&grant_type=client_credentials");
    var token = await rs.json();
    return token.access_token;
}

$("#load-more").on("click", () => {
    offset += limit;
    if (offset > arrID.length) offset = arrID.length;
    addDataToWeb();
});

$("#dong-gop .title").on("click", () => {
    $("body").toggleClass("darker");
    $("#dong-gop").find(".preview").slideToggle(200);
    $("#dong-gop input")[0].value = "";
});
$("#dong-gop .sendID").click("click", () => {
    let fbID = $("#dong-gop input")[0].value;
    if (!fbID) return;
    $.ajax({
        url: thisDomain + "postID.php",
        method: "POST",
        data: {
            "id": fbID
        },
        success: () => {
            console.log("send success");
        },
        error: () => {
            console.log("send error");
        }
    });
    $("#dong-gop .title").click();
});

$("#dong-gop input").on("input", async() => {

    $("#dong-gop .preview-avatar img").attr("src", "");
    $("#dong-gop .preview-name").text("...");
    $(".sendID").slideUp(200);

    let id = $("#dong-gop input")[0].value;
    let url = "https://graph.facebook.com/v2.10/" + id + "?" +
        $.param({
            "access_token": (token),
            "fields": "name,picture.width(320),metadata{type}",
            "metadata": 1
        });
    await fetch(url, {
        method: "GET"
    }).then((res) => {
        return res.json();
    }).then((json) => {
        if (!json.picture || json.metadata.type !== "user") {
            return;
        };
        $("#dong-gop .preview-avatar img").attr("src", json.picture.data.url);
        $("#dong-gop .preview-name").text(json.name);
        $(".sendID").slideDown(200);
    });
});

$(window).scroll((e) => {
    $(".link-hide").each((i, val) => {
        if ($(val).visible(true)) {
            $(val).removeClass("link-hide");
        }
    });
})