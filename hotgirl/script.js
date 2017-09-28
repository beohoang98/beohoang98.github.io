/**
 * 
 */

function readTextFile(file)
{
   	$.ajax({
   		url: file,
   		success: function(data) {
   			var arrID = data.split("\n");
           	arrID.forEach((fbID, index)=>{
           		if (index%2==0) return;
           		var link = createLink(index, fbID);
           		$("#content").append(link);
           		getImage(index, fbID);
           	});
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

function getImage(id, fbID) {
	var fburl = "//graph.facebook.com/"+fbID+"/picture?type=large&callback=?";
	$.getJSON(fburl, function(data) {
		$("#"+id+" img").attr("src", data.data.url);
	});
}

readTextFile("data.txt");