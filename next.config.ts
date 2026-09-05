import type { NextConfig } from "next";

const repoName = "talea-simple-website";
// With a custom domain (NEXT_PUBLIC_SITE_URL) GitHub Pages serves from the
// domain root, so the repo-name basePath must not be applied.
const isGithubPages =
  process.env.GITHUB_PAGES === "true" && !process.env.NEXT_PUBLIC_SITE_URL;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
