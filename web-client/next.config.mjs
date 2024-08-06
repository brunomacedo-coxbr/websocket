/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',

  webpack(config, { isServer }) {
    // Ensure no unwanted rules or plugins are creating .txt files
    // Example rule to ensure .txt files are not processed
    config.module.rules.push({
      test: /\.txt$/,
      use: 'ignore-loader'
    });

    return config;
  }
};

export default nextConfig;
