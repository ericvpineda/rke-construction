/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        addDir: true,
    },
    images: {
        domains: ["images.unsplash.com", "tailwindui.com"]
    }
}

module.exports = nextConfig
