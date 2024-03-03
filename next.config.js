/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["hotware.blob.core.windows.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/seed/**",
      },
      {
        protocol: "https",
        hostname: "app.hotwork.ag",
        port: "",
        pathname: "/asset/images/protocols/ventilator/**",
      },
      {
        protocol: "https",
        hostname: "app.hotwork.ag",
        port: "",
        pathname: "/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/ventilator/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/compressed_equipments/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/equipments/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/image-preview/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/m/**",
      },
      {
        protocol: "https",
        hostname: "hotware.blob.core.windows.net",
        port: "",
        pathname: "/apps/Hotware/app/**",
      },
      {
        protocol: "https",
        hostname: "api.hotwork.ag",
        port: "",
        pathname: "/equipments/**",
      },
    ],
  },
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
