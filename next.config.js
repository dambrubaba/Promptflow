/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// Disable telemetry during the build
process.env.NEXT_TELEMETRY_DISABLED = "1";

module.exports = nextConfig;
