import { motion } from "framer-motion";
import { GitHubRepo, LANGUAGE_COLORS } from "@/hooks/useGitHubRepos";
import { Star, GitFork, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

const RepoCard = ({ repo, index }: RepoCardProps) => {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#888" : null;

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group block rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:glow-border-hover hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-heading text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            <span className="text-muted-foreground font-normal">{repo.owner.login}/</span>{repo.name}
          </h3>
          {repo.fork && (
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-heading font-semibold">
              fork
            </span>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {repo.description || "No description provided."}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-heading"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {langColor && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {repo.forks_count}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
        </span>
      </div>
    </motion.a>
  );
};

export default RepoCard;
