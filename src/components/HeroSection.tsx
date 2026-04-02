import { motion } from "framer-motion";
import { useGitHubUser } from "@/hooks/useGitHubRepos";
import { Github, MapPin, ExternalLink } from "lucide-react";

const HeroSection = () => {
  const { data: user } = useGitHubUser();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span className="font-heading text-sm text-muted-foreground">
              ~/portfolio <span className="text-primary">$</span> whoami
            </span>
          </motion.div>

          {user?.avatar_url && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-24 h-24 rounded-full mx-auto ring-2 ring-primary/50 glow-border"
              />
            </motion.div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4">
            <span className="gradient-text">{user?.name || "cederache"}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 font-body max-w-xl mx-auto">
            {user?.bio || "Developer crafting code, one commit at a time."}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground mb-8">
            {user?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                {user.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Github className="w-4 h-4 text-primary" />
              {user?.public_repos || "—"} repos
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <a
              href={user?.html_url || `https://github.com/cederache`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold hover:opacity-90 transition-opacity glow-border"
            >
              <Github className="w-4 h-4" />
              GitHub Profile
            </a>
            {user?.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-heading text-sm font-semibold hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
