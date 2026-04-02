import fs from "fs";
import path from "path";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

const WEB_USDZ_PREFIX = "/web-usdz-viewer";

const MIME_BY_EXT: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".usdz": "model/vnd.usdz+zip",
};

function copyWebUsdzViewer(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (ent.name === ".git") continue;
    const from = path.join(srcDir, ent.name);
    const to = path.join(destDir, ent.name);
    if (ent.isDirectory()) copyWebUsdzViewer(from, to);
    else fs.copyFileSync(from, to);
  }
}

function webUsdzViewerPlugin(): Plugin {
  const root = path.resolve(__dirname, "web-usdz-viewer");

  const serve: Connect.NextHandleFunction = (req, res, next) => {
    const raw = req.url?.split("?")[0] ?? "";
    if (!raw.startsWith(WEB_USDZ_PREFIX)) {
      next();
      return;
    }
    if (raw === WEB_USDZ_PREFIX) {
      res.statusCode = 302;
      res.setHeader("Location", `${WEB_USDZ_PREFIX}/`);
      res.end();
      return;
    }

    let rel = raw.slice(WEB_USDZ_PREFIX.length);
    if (rel === "" || rel === "/") rel = "/index.html";

    const segments = rel.split("/").filter(Boolean);
    const safe = path.normalize(segments.join(path.sep)).replace(/^(\.\.(\/|\\|$))+/, "");
    const filePath = path.resolve(root, safe);

    if (!filePath.startsWith(path.resolve(root)) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      next();
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", MIME_BY_EXT[ext] ?? "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  };

  return {
    name: "web-usdz-viewer-static",
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
    closeBundle() {
      if (!fs.existsSync(root)) return;
      const dest = path.resolve(__dirname, "dist/web-usdz-viewer");
      copyWebUsdzViewer(root, dest);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [webUsdzViewerPlugin(), react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
