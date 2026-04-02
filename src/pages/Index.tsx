import HeroSection from "@/components/HeroSection";
import RepoList from "@/components/RepoList";
import AboutContact from "@/components/AboutContact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RepoList />
      <AboutContact />

      <footer className="border-t border-border py-6">
        <div className="container px-6 text-center">
          <p className="text-xs text-muted-foreground font-heading">
            Built with <span className="text-primary">♥</span> — powered by GitHub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
