
$(document).ready(function() {
    let Content = $('.slide-content').first();
    var slide;

    $.getJSON("https://api.github.com/users/beohoang98/repos",function(all_repos) {
        var len = all_repos.length;
        var count = 0;
        Content.css("width",len*100+"%")
                .css("max-width", len*300+"px")
                .attr("numOfSlide",len);
        $.each(all_repos, function(id, repos) {
            $.getJSON(repos.url).done(function(data) {
                slide = createSlide(data, count).css("width", 100/len+"%");
                Content.append(slide.clone(true));
                ++count;
                if (id==len-1) {
                    seeSlide(len/2);
                }
            });
        });
    });
});

function createSlide(data, id) {
    var slideWrap = $("<div/>").addClass("slide-mem-wrap").attr("id","slide"+id);
    var slide = $("<div/>").addClass("slide-mem").appendTo(slideWrap);
    var slideName = createSlide_name(data.name).appendTo(slide);
    var slideStar = createSlide_star(data.stargazers_count).appendTo(slide);
    var slideUpdated = createSlide_updatedAt(data.updated_at).appendTo(slide);
    var slideLanguage = createSlide_language(data.language).appendTo(slide);
    var slideLink = createSlide_linkToGithub(data.html_url).appendTo(slide);

    slideWrap.click(function() {
        seeSlide(id);
    });

    return slideWrap;
}

function createSlide_name(name) {
    var slideName = $("<div/>").addClass("slide-mem-name")
                                .html(name);
    return slideName;
}

function createSlide_star(stargazers_count) {
    var slideStar = $("<div/>").addClass("slide-mem-stars")
                                .html("<i class=\"star\">&#9733;</i>"+stargazers_count);
    return slideStar;
}

function createSlide_language(language) {
    var slideLanguage = $("<div/>").addClass("slide-mem-language")
                                .html(language);
    return slideLanguage;
}

function createSlide_linkToGithub(html_url) {
    var slideLink = $("<div/>").addClass("slide-mem-link")
                            .html("<a href=\""+html_url+"\" target=\"_blank\">See on Github</a>");
    return slideLink;
}

function createSlide_updatedAt(updated_at) {
    var day = new Date(updated_at);
    day = day.getDate() +"/"+ (day.getMonth()+1) +"/"+ day.getFullYear();
    var slideUpdated = $("<div/>").addClass("slide-mem-updated")
                                .html(day);
    return slideUpdated;
}

var curSlide = 0;
var oldSlide = 0;

function seeSlide(id) {
    oldSlide = curSlide;
    curSlide = id;
    $("#slide"+oldSlide).removeClass("slideOnView");
    var slide = $("#slide"+id).addClass("slideOnView");
    var containerW = $(".slide-container").outerWidth();
    $(".slide-content").css("left", -slide.position().left-slide.outerWidth()/2 + containerW/2);
}

function changeSlide(n) {
    var len = $(".slide-content").attr("numOfSlide");
    if ((n>0 && curSlide<len-1)||(n<0 && curSlide>0)) {
        oldSlide = curSlide;
        seeSlide(curSlide + n);
    }
}
