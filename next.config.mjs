import { redirects } from './lib/redirects.js';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: { styledComponents: true },
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  async redirects() {
    return redirects;
  },
};

export default (phase) => ({
  ...nextConfig,
  // Keep a running dev server from overwriting production build files.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? (process.env.CYCLONIC_DEV_OUTPUT || '.next') : '.next-production',
});
