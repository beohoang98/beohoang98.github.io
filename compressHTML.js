const fs = require('fs');
const fsCss = require('fs');

let dataCom;

fs.readFile("index.bhtml", 'utf8', (err, data)=>{
	if (err) {
		console.log(err);
		return;
	}

	let reg = /\<link.*compress.*href=\"(.*\.css)\"\>/g;
	let dataMatch = data.match(reg);
	dataCom = data;

	for (let i = 0, len = dataMatch.length; i < len; ++i) {
		let src = dataMatch[i].match(/href=\"(.*\.css)\"/)[1];
		console.log(src);

		fsCss.readFile(src, 'utf8', function(cssErr, cssData) {
			if (cssErr) {
				console.log(cssErr);
				return;
			}
			else {
				dataCom = dataCom.replace(dataMatch[i], "<style>"+cssData+"</style>");
				dataCom = dataCom.replace(/[\t\r\n]+/g, "");

				setTimeout(()=>{
					fs.writeFile("index.html", dataCom, function(err){
						if (err) console.log(err);
					});
				}, 1000);				
			}
		});	
	}

	// console.log(1);
	// dataCom = dataCom.replace(/[ \t]+/g, ' ');
	// fs.writeFile("indexCom.html", dataCom, function(err){
	// 	if (err) console.log(err);
	// });
});