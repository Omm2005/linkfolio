/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
          { hostname: 'uploadthing.com' },
          { hostname: 'utfs.io' },
          { hostname: 'lh3.googleusercontent.com' },
          { hostname: "api.microlink.io" }
        ]
      },
};


export default config;
