/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_APP_SUPABASE_URL: process.env.NEXT_APP_SUPABASE_URL,
        NEXT_APP_SUPABASE_READONLY_KEY: process.env.NEXT_APP_SUPABASE_READONLY_KEY,
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
