import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { siGithub, siInstagram } from "simple-icons";
import { LinkedInMark, SimpleBrandIcon } from "@/components/SimpleBrandIcon";

const linkClass =
  "inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-foreground font-heading text-sm font-semibold hover:border-primary/50 hover:glow-border transition-all";

const glowingLinkClass =
  "inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold hover:opacity-90 transition-opacity glow-border";

const AboutContact = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading gradient-text mb-4">
              Let's Connect
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              I'm always open to interesting projects and collaborations.
              Feel free to reach out if you'd like to work together or just chat about tech.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/cederache"
                target="_blank"
                rel="noopener noreferrer"
                className={glowingLinkClass}
              >
                <SimpleBrandIcon icon={siGithub} className="w-4 h-4 shrink-0" />
                GitHub
              </a>
              <a
                href="https://instagram.com/cedric.derache"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <SimpleBrandIcon icon={siInstagram} className="w-4 h-4 shrink-0" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/c%C3%A9dric-derache-1b5bb575/"
                target="_blank"
                rel="noopener noreferrer"
                className={glowingLinkClass}
              >
                <LinkedInMark className="w-4 h-4 shrink-0" />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
