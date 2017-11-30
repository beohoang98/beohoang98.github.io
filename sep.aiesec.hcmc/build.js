async function getToken() {
	let appID = "";
	let secretID = "";
	let result = await fetch("", {
		method:"get",
		body: {
			client_id:appID,
			client_secret:secretID,
			asd:"";
		}
	});
	let json = wait result.json();
	return json.response.access_token;
}