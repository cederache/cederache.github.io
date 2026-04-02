import { useQuery } from "@tanstack/react-query";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  homepage: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
}

interface GitHubOrg {
  login: string;
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
}

const GITHUB_USERNAME = "cederache";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

function getHeaders(): HeadersInit {
  if (GITHUB_TOKEN) {
    return { Authorization: `Bearer ${GITHUB_TOKEN}` };
  }
  return {};
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    const separator = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${separator}per_page=100&page=${page}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data: T[] = await res.json();
    if (data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

/**
 * Fetch the user's public events to build a set of repos they've interacted with.
 * This uses at most 10 API calls (vs N calls for checking each repo individually).
 */
async function fetchContributedRepoNames(): Promise<Set<string>> {
  const events = await fetchAllPages<GitHubEvent>(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public`
  );

  const contributionTypes = new Set([
    "PushEvent",
    "PullRequestEvent",
    "PullRequestReviewEvent",
    "IssuesEvent",
    "IssueCommentEvent",
    "CommitCommentEvent",
    "CreateEvent",
  ]);

  const repoNames = new Set<string>();
  for (const event of events) {
    if (contributionTypes.has(event.type)) {
      repoNames.add(event.repo.name.toLowerCase());
    }
  }
  return repoNames;
}

async function isUserContributor(repo: GitHubRepo): Promise<boolean> {
  // User-owned non-fork repos: always a contributor
  if (repo.owner.login.toLowerCase() === GITHUB_USERNAME.toLowerCase() && !repo.fork) {
    return true;
  }
  try {
    // Check if user has commits in this repo (1 call, lightweight)
    const res = await fetch(
      `https://api.github.com/repos/${repo.full_name}/commits?author=${GITHUB_USERNAME}&per_page=1`,
      { headers: getHeaders() }
    );
    if (!res.ok) return true; // On error, include to be safe
    const commits = await res.json();
    return Array.isArray(commits) && commits.length > 0;
  } catch {
    return true;
  }
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const [userRepos, orgs] = await Promise.all([
    fetchAllPages<GitHubRepo>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&type=all`
    ),
    fetchAllPages<GitHubOrg>(
      `https://api.github.com/users/${GITHUB_USERNAME}/orgs`
    ),
  ]);

  const orgRepoArrays = await Promise.all(
    orgs.map((org) =>
      fetchAllPages<GitHubRepo>(
        `https://api.github.com/orgs/${org.login}/repos?sort=updated&type=public`
      )
    )
  );

  const allRepos = [...userRepos, ...orgRepoArrays.flat()];
  const unique = Array.from(new Map(allRepos.map((r) => [r.id, r])).values());

  const isUserOwned = (repo: GitHubRepo) =>
    repo.owner.login.toLowerCase() === GITHUB_USERNAME.toLowerCase();
  const userOwnedRepos = unique.filter(isUserOwned);
  const orgRepos = unique.filter((repo) => !isUserOwned(repo));

  // Contributor filter applies only to org repos; user-owned repos are kept as-is.
  let filtered: GitHubRepo[];
  if (GITHUB_TOKEN) {
    const checks = await Promise.all(
      orgRepos.map(async (repo) => ({
        repo,
        keep: await isUserContributor(repo),
      }))
    );
    const keptOrgRepos = checks.filter((c) => c.keep).map((c) => c.repo);
    filtered = [...userOwnedRepos, ...keptOrgRepos];
  } else {
    const contributedRepos = await fetchContributedRepoNames();
    const keptOrgRepos = orgRepos.filter((repo) =>
      contributedRepos.has(repo.full_name.toLowerCase())
    );
    filtered = [...userOwnedRepos, ...keptOrgRepos];
  }

  filtered.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  return filtered;
}

async function fetchUser(): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ["github-repos", GITHUB_USERNAME],
    queryFn: fetchRepos,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGitHubUser() {
  return useQuery({
    queryKey: ["github-user", GITHUB_USERNAME],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
  });
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
};
