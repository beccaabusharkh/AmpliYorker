import { defineConfig, loadEnv, type IndexHtmlTransformContext, type Plugin } from "vite";

/** US-zone Amplitude Web Experiment standalone CDN (not full Unified API_KEY.js). */
function amplitudeWebExperimentScript(mode: string): Plugin {
  return {
    name: "amplitude-web-experiment-script",
    transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      const env = loadEnv(mode, process.cwd(), "");
      const apiKey = (env.VITE_AMPLITUDE_API_KEY ?? "").trim();
      const marker = "<!-- amplitude-web-experiment-script -->";
      const snippet = apiKey
        ? `<script src="https://cdn.amplitude.com/script/${apiKey}.experiment.js"></script>`
        : "<!-- Amplitude Web Experiment CDN skipped (VITE_AMPLITUDE_API_KEY unset) -->";
      if (!html.includes(marker)) {
        return html.replace("</head>", `    ${snippet}\n  </head>`);
      }
      return html.replace(marker, snippet);
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/AmpliYorker/",
  plugins: [amplitudeWebExperimentScript(mode)],
  build: {
    outDir: "dist",
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
}));