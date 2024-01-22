var config = (function () {
  var json = null;
  $.ajax({
    async: false,
    global: false,
    url: "/config.json",
    dataType: "json",
    success: function (data) {
      json = data;
    },
  });
  return json;
})();

var headers = [
  {
    name: "User-Agent",
    value: config[0].username,
  },
];

/**
 * Performs a synchronous HTTP GET request.
 * @param {string} theUrl - The URL to send the request to.
 * @param {Array} headers - An array of headers to include in the request.
 * Each header object should have a `name` property (the header name) and a `value` property (the header value).
 * @returns {string} - The response text from the HTTP GET request.
 */
function httpGet(theUrl, headers) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", theUrl, false); // false for synchronous request
  headers.forEach((header) => {
    xhr.setRequestHeader(header.name, header.value);
  });
  xhr.send(null);
  return xhr.responseText;
}

const reposResponse = JSON.parse(
  httpGet(`https://api.github.com/users/${config[0].username}/repos`, headers)
).sort((a, b) => {
  const aUpdatedAt = Date.parse(a.pushed_at);
  const bUpdatedAt = Date.parse(b.pushed_at);

  if (isNaN(aUpdatedAt) || isNaN(bUpdatedAt)) {
    return a.name.localeCompare(b.name);
  }
  return bUpdatedAt - aUpdatedAt;
});

const repos_section = document.getElementById("repos_section");
const fork_section = document.getElementById("forks_section");

var reposInnerHtml = "";
var forkInnerHtml = "";
// Loop over repos
for (index in reposResponse) {
  var repo = reposResponse[index];

  if (repo.language === null) {
    repo.language = "-";
  }

  var innerHtml =
    `<a href="${repo.html_url}" target="_blank">
						<section>
							<div class="section_title">${repo.name}</div>` +
    (repo.description !== null
      ? `<div class="about_section">
								<span style="display:block;">${repo.description}</span>
							</div>`
      : "") +
    `<div class="bottom_section">
								<span style="display:inline-block;"><i class="fas fa-code"></i>&nbsp; ${
                  repo.language
                }</span>
								<span><i class="fas fa-star"></i>&nbsp; ${repo.stargazers_count}</span>
								<span><i class="fas fa-code-branch"></i>&nbsp; ${repo.forks_count}</span>
							</div>
							<span style="float:right">Last push : ${new Date(
                repo.pushed_at
              ).toLocaleDateString()}</span>
						</section>
						</a>`;
  if (repo.fork) {
    forkInnerHtml += innerHtml;
  } else {
    reposInnerHtml += innerHtml;
  }
}

repos_section.innerHTML = reposInnerHtml;
fork_section.innerHTML = forkInnerHtml;
