var config = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "/config.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var headers = [{
	"name": "User-Agent",
	"value": config[0].username
}];

function httpGet(theUrl, headers) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	for (index in headers) {
		var header = headers[index];
		xmlHttp.setRequestHeader(header["name"], header["value"]);
	}
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

const reposResponse = JSON.parse(httpGet(`https://api.github.com/users/${config[0].username}/repos`, headers)).sort((a, b) => {
	const aUpdatedAt = Date.parse(a.updated_at);
	const bUpdatedAt = Date.parse(b.updated_at);
	
	if (aUpdatedAt === NaN || bUpdatedAt === NaN) {
		return a.name.localeCompare(b.name);
	}
	return bUpdatedAt - aUpdatedAt;
});

const work_section = document.getElementById("work_section");
const fork_section = document.getElementById("forks_section");

var workInnerHtml = "";
var forkInnerHtml = "";
// Loop over repos
for (index in reposResponse) {
	var repo = reposResponse[index];

	var innerHtml = `<a href="${repo.html_url}" target="_blank">
						<section>
							<div class="section_title">${repo.name}</div>` +
							(repo.description !== null ? `<div class="about_section">
								<span style="display:block;">${repo.description}</span>
							</div>` : '') +
							`<div class="bottom_section">
								<span style="display:inline-block;"><i class="fas fa-code"></i>&nbsp; ${repo.language}</span>
								<span><i class="fas fa-star"></i>&nbsp; ${repo.stargazers_count}</span>
								<span><i class="fas fa-code-branch"></i>&nbsp; ${repo.forks_count}</span>
							</div>
							<span style="float:right">Last modification : ${(new Date(repo.updated_at)).toLocaleDateString()}</span>
						</section>
						</a>`;
	if (repo.fork) {
		forkInnerHtml += innerHtml;
	} else {
		workInnerHtml += innerHtml;
	}
}

work_section.innerHTML = workInnerHtml;
fork_section.innerHTML = forkInnerHtml;