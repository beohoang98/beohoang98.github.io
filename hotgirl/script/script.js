/**
 *
 */

var limit = 25;
var offset = 0;
var arrID = [];
var token;
var offset_display = 0;

// var DIR = "/hotgirl/"; //for herokuu
// var DIR = "./";
var DIR = "http://beohoang98.herokuapp.com/hotgirl/"; // for github.io

function addDataToWeb() {
    for (var index = offset; index < limit + offset; ++index) {
        if (index >= arrID.length) break;
        var link = createLink(arrID[index]);
        $("#content").append(link);
        getAndCreateInfoTab(arrID[index]);
    }
    $("#pages").html((offset+limit)+"/"+arrID.length);
}

async function getFBID() {
    $.getJSON(DIR+"api/getID.php",(json)=>{
        console.log(json);
        arrID = json.data;
    }).fail((err)=>{
        console.log("fail");
    }).then(()=>{
        addDataToWeb();
    });
}

function createLink(fbID) {
    var wrap = $("<div/>").addClass("link link-hide")
        .attr("id", fbID);
    var link = $("<a/>").attr("target", "_blank")
        .attr("href", "https://www.facebook.com/" + fbID);
    var img = $("<img/>").appendTo(link);

    wrap.append(link);
    return wrap;
};

function getAndCreateInfoTab(fbID) {
    $.ajax({
        url: DIR+"api/getFBData.php?id=" + fbID,
        success: function(data) {
            $("#" + fbID + " img").attr("src", data.picture.url);
            var tab = createInfoTab(data);
            $("#" + fbID).append(tab);
        },
        error: function() {
            console.log("error " + fbID + ".");
            $("#" + index).remove();
            $.ajax({
                url: DIR + "api/remove.php",
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
        $.ajax({
            url: DIR + "api/removeID.php",
            method: "POST",
            data: {
                "id": FBdata.id
            },
            dataType: 'json',
            success: (res) => {
                $("#"+res.id).addClass("link-removed");
                console.log("send remove success");
                console.log(res);
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

$(document).one("DOMContentLoaded", async() => {
    getFBID().then(()=>{
        console.log("LOADED");
        $("#wait").remove();
    });
});

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
        url: DIR + "api/postID.php",
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

$(window).scroll((e) => {
    $(".link-hide").each((i, val) => {
        if ($(val).visible(true)) {
            $(val).removeClass("link-hide");
        }
    });
})