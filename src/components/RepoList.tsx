import { useState } from "react";
import { useGitHubRepos } from "@/hooks/useGitHubRepos";
import RepoCard from "./RepoCard";
import { Loader2 } from "lucide-react";

type FilterType = "all" | "sources" | "forks";

const RepoList = () => {
  const { data: repos, isLoading, error } = useGitHubRepos();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = repos?.filter((repo) => {
    if (filter === "sources") return !repo.fork;
    if (filter === "forks") return repo.fork;
    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "sources", label: "Sources" },
    { key: "forks", label: "Forks" },
  ];

  return (
    <section className="py-20">
      <div className="container px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading gradient-text mb-2">
              Repositories
            </h2>
            <p className="text-muted-foreground">
              What I'm currently working on & contributing to.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-md text-xs font-heading font-medium transition-all ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
                {repos && (
                  <span className="ml-1.5 opacity-70">
                    {f.key === "all"
                      ? repos.length
                      : f.key === "sources"
                      ? repos.filter((r) => !r.fork).length
                      : repos.filter((r) => r.fork).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground font-heading text-sm">
              Fetching repos...
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive font-heading text-sm">
              Failed to load repositories. GitHub API rate limit may have been reached.
            </p>
          </div>
        )}

        {filtered && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20 font-heading text-sm">
            No repositories found for this filter.
          </p>
        )}
      </div>
    </section>
  );
};

export default RepoList;
