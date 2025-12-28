/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    },

    // Optimize for production
    output: 'standalone',

    // Handle Plotly.js properly
    transpilePackages: ['plotly.js', 'react-plotly.js'],

    // Webpack configuration for KaTeX and Plotly
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });
        return config;
    },

    // Disable DevTools UI (The "N" button)
    devIndicators: false,
};

module.exports = nextConfig;
