var profileData;
var limit = 10;
var base64Token;

async function loadProfileData(query) {
    let url = "https://graph.facebook.com/v2.10/search?type=user&limit="+limit
                                                            +"&q="+query
                                                            +"&access_token="+atob(base64Token)
                                                            // + "&access_token=" + uatoken
                                                            +"&fields=name,id,picture.width(100),link,is_verified";
    let result = await fetch(url);
    let json = await result.json();
    profileData = json.data;
}

async function displaySearch() {
    $("#content").children().fadeOut(200, ()=>{
        $(this).remove();
    });
    let query = $("textarea")[0].value;
    await loadProfileData(query);
    profileData.forEach((json)=>{
        $("#"+json.id).remove();
        var profile = $("<div/>").addClass("profile").attr("id",json.id);
        var wrap_link = $("<a/>").addClass("flexbox")
                                    .attr("href", json.link)
                                    .attr("target", "_blank")
                                    .appendTo(profile);
        var image = $("<div/>").addClass("profile-img flexitem")
                                .html("<img src='"+json.picture.data.url+"' />")
                                .appendTo(wrap_link);
        var name = $("<div/>").addClass("profile-name flexitem")
                                .html(json.name)
                                .appendTo(wrap_link);
        var verified = $("<div/>").addClass("profile-verify flexitem verify-"+json.is_verified)
                                    .appendTo(wrap_link);
        $("#content").append(profile.fadeIn(200));
    })
}

$("textarea").on("input", async()=>{
    FB.getLoginStatus(function(response) {
        base64Token = btoa(response.authResponse.accessToken);
    });
    await displaySearch();
});
