/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
    test: /\.svg$/,
    
    use: ['@svgr/webpack'],
    });

    return config;
},
}

// module.exports = {
//   webpack(config) {
//       config.module.rules.push({
//       test: /\.svg$/,
//       issuer: {
//           test: /\.(js|ts)x?$/,
//           // { and: [/\.(js|ts)x?$/] }
//       },
      
//       use: ['@svgr/webpack'],
//       });

//       return config;
//   },
// };

module.exports = nextConfig
