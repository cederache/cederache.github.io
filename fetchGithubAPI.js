/**
 * Retrieves the configuration data from a JSON file.
 * @returns {Object} - The configuration data.
 */
function getConfig(callback) {
  $.ajax({
    async: false,
    global: false,
    url: "/config.json",
    dataType: "json",
    success: function (data) {
      config = data;
      callback();
    },
  });
}

/**
 * Performs a synchronous HTTP GET request.
 * @param {string} theUrl - The URL to send the request to.
 * Each header object should have a `name` property (the header name) and a `value` property (the header value).
 * @returns {string} - The response text from the HTTP GET request.
 */
function httpGet(theUrl) {
  // Create an array of headers based on the retrieved configuration data
  const requestHeaders = [
    {
      name: "User-Agent",
      value: config[0].username,
    },
  ];

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Open a synchronous GET request to the specified URL
  xhr.open("GET", theUrl, false);

  // Set the request headers
  requestHeaders.forEach((header) => {
    xhr.setRequestHeader(header.name, header.value);
  });

  // Send the request
  xhr.send(null);

  // Return the response text
  return xhr.responseText;
}

/**
 * Fetches and displays a user's repositories from the GitHub API.
 */
function fetchRepos() {
  // Fetch repositories from the GitHub API
  const reposResponse = JSON.parse(httpGet(`https://api.github.com/users/${config[0].username}/repos`)).sort((a, b) => {
    const aUpdatedAt = Date.parse(a.pushed_at);
    const bUpdatedAt = Date.parse(b.pushed_at);

    if (isNaN(aUpdatedAt) || isNaN(bUpdatedAt)) {
      return a.name.localeCompare(b.name);
    }
    return bUpdatedAt - aUpdatedAt;
  });

  // Get DOM elements
  const reposSection = document.getElementById("repos_section");
  const forkSection = document.getElementById("forks_section");

  // Initialize HTML content variables
  let reposInnerHtml = "";
  let forkInnerHtml = "";

  // Loop over repositories
  for (const repo of reposResponse) {
    // Set default language if null
    const language = repo.language || "-";

    // Construct HTML string for repository
    const innerHtml = `
      <a href="${repo.html_url}" target="_blank">
        <section>
          <div class="section_title">${repo.name}</div>
          ${
            repo.description !== null
              ? `
            <div class="about_section">
              <span style="display:block;">${repo.description}</span>
            </div>`
              : ""
          }
          <div class="bottom_section">
            <span style="display:inline-block;"><i class="fas fa-code"></i>&nbsp; ${language}</span>
            <span><i class="fas fa-star"></i>&nbsp; ${repo.stargazers_count}</span>
            <span><i class="fas fa-code-branch"></i>&nbsp; ${repo.forks_count}</span>
          </div>
          <span style="float:right">Last push : ${new Date(repo.pushed_at).toLocaleDateString()}</span>
        </section>
      </a>`;

    // Append HTML string to appropriate content variable
    if (repo.fork) {
      forkInnerHtml += innerHtml;
    } else {
      reposInnerHtml += innerHtml;
    }
  }

  // Display repositories on the webpage
  reposSection.innerHTML = reposInnerHtml;
  forkSection.innerHTML = forkInnerHtml;
}

var config = null;

document.onreadystatechange = function () {
  // Retrieve the configuration data from a JSON file
  config = getConfig(() => {
    // Fetch and display the user's repositories from the GitHub API
    fetchRepos();
  });
};
